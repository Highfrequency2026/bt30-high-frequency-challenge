import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();
    const results = {
      pastDueReminders: 0,
      suspended: 0,
      waiverReminders: 0,
      photoReminders: 0,
      errors: [],
    };

    const MS_PER_DAY = 24 * 60 * 60 * 1000;

    // 1. PAST-DUE / GRACE PERIOD: Find past_due members.
    //    - If past_due for >= 7 days: suspend access, deactivate QR credentials.
    //    - Otherwise: send payment reminder email.
    try {
      const pastDueMembers = await base44.entities.Members.filter({ membership_status: 'past_due' });
      for (const member of (pastDueMembers || [])) {
        try {
          const updatedDate = new Date(member.updated_date);
          const daysPastDue = Math.floor((now - updatedDate) / MS_PER_DAY);

          if (daysPastDue >= 7) {
            await base44.entities.Members.update(member.id, {
              membership_status: 'suspended',
              access_status: 'denied',
            });
            // Deactivate QR credentials
            const creds = await base44.entities.AccessCredentials.filter({ member_id: member.id, credential_type: 'qr_pass', active: true });
            for (const cred of (creds || [])) {
              await base44.entities.AccessCredentials.update(cred.id, { active: false });
            }
            results.suspended++;
          } else {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: member.email,
              subject: 'Payment Overdue — Action Required',
              body: `Hi ${member.first_name},\n\nYour High Frequency membership payment is overdue. Please update your payment method as soon as possible. If payment is not received within 7 days, your facility access will be suspended.\n\nIf you've already updated your payment, please disregard this message.\n\nThank you,\nThe High Frequency Team`,
            });
            results.pastDueReminders++;
          }
        } catch (err) {
          results.errors.push(`past_due member ${member.id}: ${err.message}`);
        }
      }
    } catch (err) {
      results.errors.push(`past_due query: ${err.message}`);
    }

    // 2. WAIVER REMINDERS: Members with pending waivers created > 24 hours ago.
    try {
      const pendingWaiverMembers = await base44.entities.Members.filter({ waiver_status: 'pending' });
      const twentyFourHoursAgo = new Date(now.getTime() - MS_PER_DAY);
      for (const member of (pendingWaiverMembers || [])) {
        try {
          const createdDate = new Date(member.created_date);
          if (createdDate < twentyFourHoursAgo) {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: member.email,
              subject: 'Reminder: Sign Your Membership Agreements',
              body: `Hi ${member.first_name},\n\nThis is a friendly reminder to sign your membership agreements and waivers. Your membership cannot be fully activated until all agreements are signed.\n\nPlease log in to your High Frequency account to complete the signing process.\n\nThank you,\nThe High Frequency Team`,
            });
            results.waiverReminders++;
          }
        } catch (err) {
          results.errors.push(`waiver reminder ${member.id}: ${err.message}`);
        }
      }
    } catch (err) {
      results.errors.push(`waiver query: ${err.message}`);
    }

    // 3. PHOTO REMINDERS: Active members without photos, activated > 48 hours ago.
    try {
      const activeMembers = await base44.entities.Members.filter({ membership_status: 'active' });
      const fortyEightHoursAgo = new Date(now.getTime() - 2 * MS_PER_DAY);
      for (const member of (activeMembers || [])) {
        try {
          if (!member.photo_url && member.membership_start_date) {
            const startDate = new Date(member.membership_start_date);
            if (startDate < fortyEightHoursAgo) {
              await base44.asServiceRole.integrations.Core.SendEmail({
                to: member.email,
                subject: 'Reminder: Upload Your Membership Photo',
                body: `Hi ${member.first_name},\n\nThis is a friendly reminder to upload your membership photo. Your photo is required for your digital access pass and member identification.\n\nPlease log in to your High Frequency account to upload your photo.\n\nThank you,\nThe High Frequency Team`,
              });
              results.photoReminders++;
            }
          }
        } catch (err) {
          results.errors.push(`photo reminder ${member.id}: ${err.message}`);
        }
      }
    } catch (err) {
      results.errors.push(`photo query: ${err.message}`);
    }

    console.log('membership-automations completed', JSON.stringify(results));
    return Response.json({ success: true, results });
  } catch (error) {
    console.error('membership-automations error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}