// Hooks
import { useIssueModal } from '../../hooks/issue/useIssueModal';

// Types
import type {
  IssueData,
  IssueStatus,
  IssuePriority,
} from '../../types/issueTypes';

// Styles
import styles from './IssueModal.module.css';

interface IssueModalProps {
  issue: IssueData;
  originAllIssue: boolean;
  onClose: () => void;
  onIssueUpdated?: (updatedIssue: IssueData) => void;
}

export default function IssueModal({
  issue,
  originAllIssue,
  onClose,
  onIssueUpdated,
}: IssueModalProps) {
  const {
    commentMsg,
    isSubmitting,
    localThread,
    isLoadingComments,
    activeTab,
    newStatus,
    newPriority,
    isUpdating,
    isChanged,
    isPaperLeader,
    statusOptions,
    priorityOptions,
    showTaggedUsers,
    taggedUsersRef,
    setCommentMsg,
    setActiveTab,
    setNewStatus,
    setNewPriority,
    setShowTaggedUsers,
    handlePostComment,
    handleUpdateIssue,
  } = useIssueModal(issue, originAllIssue, onClose, onIssueUpdated);

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
              <span className={styles.commentCount}>
                {isLoadingComments ? '...' : localThread.length}
              </span>
            )}
          </button>
          {isPaperLeader && (
            <button
              className={`${styles.tabButton} ${activeTab === 'actions' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              Actions
            </button>
          )}
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
                  <label>Created By</label>
                  <p>{issue.author.fullName}</p>
                  <span className={styles.infoEmail}>{issue.author.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Created On</label>
                  <p>{new Date(issue.createdAt).toLocaleString()}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Tagged Users</label>
                  <div className={styles.taggedUserCont} ref={taggedUsersRef}>
                    <p>
                      {issue.userTags.length > 0
                        ? `${issue.userTags.length} users`
                        : 'None'}
                    </p>
                    {issue.userTags.length > 0 && (
                      <button
                        onClick={() => setShowTaggedUsers((prev) => !prev)}
                        className={styles.seeDetailsBtn}
                      >
                        {showTaggedUsers ? 'Hide details' : 'See details'}
                      </button>
                    )}
                    {showTaggedUsers && issue.userTags.length > 0 && (
                      <div className={styles.taggedUsersPopup}>
                        <div className={styles.taggedUsersHeader}>
                          Tagged Users
                        </div>
                        <div className={styles.taggedUsersList}>
                          {issue.userTags.map((taggedUser) => (
                            <div
                              key={taggedUser._id}
                              className={styles.taggedUserItem}
                            >
                              <span className={styles.taggedUserName}>
                                {taggedUser.fullName}
                              </span>
                              <span className={styles.taggedUserEmail}>
                                {taggedUser.email}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <label>Type</label>
                  <p>{issue.type.name}</p>
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
                {isLoadingComments ? (
                  <div className={styles.loadingComments}>
                    Loading discussion...
                  </div>
                ) : localThread.length > 0 ? (
                  localThread.map((comment) => (
                    <div key={comment._id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <div>
                          <span className={styles.commentUser}>
                            {comment.userId.fullName}
                          </span>
                          <span className={styles.infoEmail}>
                            &lt;{comment.userId.email}&gt;
                          </span>
                        </div>
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

          {/* Section 3: Actions (Paper Leader Only) */}
          {activeTab === 'actions' && isPaperLeader && (
            <div className={`${styles.actionsTab} ${styles.tabContent}`}>
              <div className={styles.actionGroup}>
                <label className={styles.actionLabel}>Change Status</label>
                <select
                  className={styles.actionSelect}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.actionGroup}>
                <label className={styles.actionLabel}>Change Priority</label>
                <select
                  className={styles.actionSelect}
                  value={newPriority}
                  onChange={(e) =>
                    setNewPriority(e.target.value as IssuePriority)
                  }
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className={styles.confirmBtn}
                disabled={!isChanged || isUpdating}
                onClick={handleUpdateIssue}
              >
                {isUpdating ? 'Updating...' : 'Confirm Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
