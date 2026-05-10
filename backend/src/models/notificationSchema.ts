// Node modules
import { Schema, Types, model } from 'mongoose';

export enum NotiTypeEnum {
  IssueCreated = 'IssueCreated',
  StatusChanged = 'StatusChanged',
  NewComment = 'NewComment',
}

export interface INotification {
  recipient: Types.ObjectId;
  actor: Types.ObjectId;
  issue: Types.ObjectId;
  notiType: NotiTypeEnum;
  message: string;
  isRead: boolean;
  stacked: number;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    actor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    issue: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Issue',
    },
    notiType: {
      type: String,
      enum: Object.values(NotiTypeEnum),
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    stacked: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

export default model<INotification>('Notification', notificationSchema);
