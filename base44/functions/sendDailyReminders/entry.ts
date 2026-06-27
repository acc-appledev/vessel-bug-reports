import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Fetch all users with reminder_time set
    const users = await base44.asServiceRole.entities.User.list();
    const usersWithReminders = users.filter(u => u.reminder_time && u.reminder_time.trim());
    
    const results = [];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    for (const user of usersWithReminders) {
      try {
        // Check if reminder time matches current time (within 1-hour window to account for schedule variance)
        const [hour, minute] = user.reminder_time.split(':').map(Number);
        const userTime = new Date();
        userTime.setHours(hour, minute, 0, 0);
        
        const timeDiffMs = Math.abs(now - userTime);
        const timeDiffMins = timeDiffMs / (1000 * 60);
        
        // Only send if we're within 60 minutes of the scheduled time
        if (timeDiffMins > 60) continue;
        
        // Fetch user's habits and journal for today
        const [habits, logs, journalEntries] = await Promise.all([
          base44.asServiceRole.entities.Habit.filter({ created_by: user.email, active: true }),
          base44.asServiceRole.entities.HabitLog.list('-date', 500),
          base44.asServiceRole.entities.JournalEntry.list('-date', 1),
        ]);
        
        const todayLogs = logs.filter(l => l.date === todayStr && l.created_by === user.email);
        const completedHabits = new Set(todayLogs.map(l => l.habit_id));
        const incompletedHabits = habits.filter(h => !completedHabits.has(h.id));
        
        const todayJournal = journalEntries.length > 0 && journalEntries[0].date === todayStr;
        
        // Build email content
        const habitList = incompletedHabits.length > 0
          ? incompletedHabits.map(h => `• ${h.name}`).join('\n')
          : 'All habits completed! ✓';
        
        const journalStatus = todayJournal
          ? 'Journal entry completed ✓'
          : 'Journal entry pending';
        
        const emailBody = `Hello ${user.full_name},

It's time to strengthen your discipline. Here's your daily reminder:

**Habits to Complete:**
${habitList}

**Journal:**
${journalStatus}

Visit Vessel to log your progress: https://vessel.app

Train your body. Renew your mind. Strengthen your spirit.

— The Vessel Team`;
        
        // Send email
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: `Your Daily Reminder — ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}`,
          body: emailBody,
          from_name: 'Vessel',
        });
        
        results.push({ email: user.email, status: 'sent' });
      } catch (userError) {
        results.push({ email: user.email, status: 'failed', error: userError.message });
      }
    }
    
    return Response.json({ sent: results.length, results });
  } catch (error) {
    console.error('sendDailyReminders error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});