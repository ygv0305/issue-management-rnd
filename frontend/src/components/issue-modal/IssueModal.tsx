// Node modules
import { useState } from 'react';

// Services
import coreService from '../../services/coreService';

// Types
import type { IssueData, CommentData } from '../../types/issueTypes';

// Styles
import styles from './IssueModal.module.css';

interface IssueModalProps {
  issue: IssueData;
  onClose: () => void;
  onCommentAdded?: (newComment: CommentData) => void;
}

export default function IssueModal({
  issue,
  onClose,
  onCommentAdded,
}: IssueModalProps) {
  const [commentMsg, setCommentMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localThread, setLocalThread] = useState<CommentData[]>(
    issue.thread || [],
  );
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  const handlePostComment = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!commentMsg.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await coreService.createComment({
        issueId: issue._id,
        message: commentMsg,
      });

      if (res.success) {
        setLocalThread([...localThread, res.data]);
        setCommentMsg('');
        if (onCommentAdded) {
          onCommentAdded(res.data);
        }
      }
    } catch (error) {
      console.error('Failed to post comment, ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3>#{issue._id.slice(-6).toUpperCase()}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </header>

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'details' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Overview
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'comments' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Discussion
            {localThread.length > 0 && (
              <span className={styles.commentCount}>{localThread.length}</span>
            )}
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Section 1: Details */}
          {activeTab === 'details' && (
            <div className={`${styles.detailsColumn} ${styles.tabContent}`}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Subject</label>
                  <p className={styles.subjectText}>{issue.subject}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Type</label>
                  <p>{issue.type.name}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Created By</label>
                  <p>{issue.author.fullName}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Created On</label>
                  <p>{new Date(issue.createdAt).toLocaleString()}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Status</label>
                  <div>
                    <span className={`statusBadge status${issue.status}`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <label>Priority</label>
                  <div>
                    <span className={`statusBadge priority${issue.priority}`}>
                      {issue.priority}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <label>Description</label>
                  <div className={styles.description}>{issue.description}</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Comments */}
          {activeTab === 'comments' && (
            <div className={`${styles.commentsContainer} ${styles.tabContent}`}>
              <div className={styles.thread}>
                {localThread.length > 0 ? (
                  localThread.map((comment, index) => (
                    <div key={index} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentUser}>
                          {comment.userId.fullName}
                        </span>
                        <span className={styles.commentTime}>
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={styles.commentMsg}>{comment.message}</p>
                    </div>
                  ))
                ) : (
                  <div className={styles.noComments}>No comments yet.</div>
                )}
              </div>

              <form className={styles.commentForm} onSubmit={handlePostComment}>
                <textarea
                  className={styles.commentInput}
                  placeholder="Post a message..."
                  value={commentMsg}
                  maxLength={1000}
                  onChange={(e) => setCommentMsg(e.target.value)}
                />
                <div className={styles.submitWrapper}>
                  <div className="charCount" style={{ textAlign: 'center' }}>
                    {commentMsg.length} / 1000 characters
                  </div>
                  <button
                    type="submit"
                    className={styles.postBtn}
                    disabled={isSubmitting || !commentMsg.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Message'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
