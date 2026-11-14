import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';

export const sendNotification = async ({ userId, title, message, type = 'info', link = '' }) => {
  try {
    if (!userId) return null;
    return await Notification.create({
      userId,
      title,
      message,
      type,
      link,
    });
  } catch (err) {
    console.error('[Notification Service Error]', err);
    return null;
  }
};

export const createAuditLog = async ({ actorId = null, action, resourceType, resourceId = '', metadata = {} }) => {
  try {
    return await AuditLog.create({
      actorId,
      action,
      resourceType,
      resourceId: String(resourceId),
      metadata,
    });
  } catch (err) {
    console.error('[Audit Log Service Error]', err);
    return null;
  }
};
