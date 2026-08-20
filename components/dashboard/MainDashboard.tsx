"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import SearchSection, { AccessCatalogItem } from "./SearchSection";
import MyRequestsSection, { RequestItem } from "./MyRequestsSection";
import ApprovalsSection from "./ApprovalsSection";
import MyBoardsSection from "./MyBoardsSection";
import AdminQueueSection from "./AdminQueueSection";
import AccessIdGovernanceSection, {
  AccessIdQueueItemData,
} from "./AccessIdGovernanceSection";
import RecentActivitySection, { AuditLogItem } from "./RecentActivitySection";
import AccessDetailsDrawer from "../drawers/AccessDetailsDrawer";
import AccessIdStatusDrawer from "../drawers/AccessIdStatusDrawer";
import RequestFormDrawer from "../drawers/RequestFormDrawer";
import ExceptionFormDrawer from "../drawers/ExceptionFormDrawer";
import RequestDetailDrawer from "../drawers/RequestDetailDrawer";
import ApprovalDetailDrawer from "../drawers/ApprovalDetailDrawer";
import BoardConfigDrawer from "../drawers/BoardConfigDrawer";
import AdminRequestDetailDrawer from "../drawers/AdminRequestDetailDrawer";
import CloseRequestModal from "../modals/CloseRequestModal";
import RejectModal from "../modals/RejectModal";
import ExceptionConfirmModal from "../modals/ExceptionConfirmModal";
import { ToastContainer } from "../ui/Toast";

interface UserSessionInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  group: string;
  title?: string | null;
  initials?: string | null;
  tone?: string | null;
}

interface MainDashboardProps {
  currentUser: UserSessionInfo;
  catalog: AccessCatalogItem[];
  requests: RequestItem[];
  governanceQueue: AccessIdQueueItemData[];
  auditLogs: AuditLogItem[];
  notifications: any[];
  allDemoUsers?: UserSessionInfo[];
}

export default function MainDashboard({
  currentUser,
  catalog,
  requests,
  governanceQueue,
  auditLogs,
  notifications,
  allDemoUsers = [],
}: MainDashboardProps) {
  // Drawer states
  const [activeDrawer, setActiveDrawer] = useState<{
    type: string;
    id: string;
  } | null>(null);

  // Modal states
  const [activeModal, setActiveModal] = useState<{
    type: string;
    data: any;
  } | null>(null);

  const isAdmin = currentUser.role === "BOARD_ADMIN";
  const firstName = currentUser.name.split(" ")[0];

  const selectedAccessItem =
    activeDrawer?.id &&
    ["access-details", "access-id-status", "request-form", "exception-form", "board-config"].includes(
      activeDrawer.type
    )
      ? catalog.find((a) => a.id === activeDrawer.id) || null
      : null;

  const selectedRequest =
    activeDrawer?.id &&
    ["request-detail", "approval-detail", "admin-request-detail"].includes(activeDrawer.type)
      ? requests.find((r) => r.id === activeDrawer.id) || null
      : null;

  const selectedQueueItem =
    selectedAccessItem
      ? governanceQueue.find((q) => q.accessItemId === selectedAccessItem.id) || null
      : null;

  const isGovernancePending = !!selectedAccessItem && !!governanceQueue.find(
    (q) => q.accessItemId === selectedAccessItem.id && q.status === "Pending Governance Review"
  );

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header
        currentUser={currentUser}
        notifications={notifications}
        allDemoUsers={allDemoUsers}
      />

      <main className="w-[92%] max-w-[1800px] mx-auto py-6 pb-14 flex flex-col gap-4">
        {/* Welcome Greeting */}
        <div className="welcome">
          <h1 className="text-[23px] font-extrabold text-[#111827] mb-1">
            {isAdmin ? `Board Admin · ${currentUser.name}` : `Welcome back, ${firstName}`}
          </h1>
          <p className="text-[13.5px] text-[var(--muted)] max-w-[760px]">
            {isAdmin
              ? "Manage the boards you administer, provision access, and review governed configuration changes."
              : "Search for access, track your requests, and act on anything awaiting your approval — all in one place."}
          </p>
        </div>

        {/* Search & Directory Section */}
        <SearchSection
          catalog={catalog}
          currentUserGroup={currentUser.group}
          onOpenAccessDetails={(accessId) =>
            setActiveDrawer({ type: "access-details", id: accessId })
          }
        />

        {/* Persona Views */}
        {isAdmin ? (
          <>
            <MyRequestsSection
              requests={requests}
              currentUserName={currentUser.name}
              compact={true}
              onOpenRequestDetail={(requestId) =>
                setActiveDrawer({ type: "request-detail", id: requestId })
              }
            />

            <ApprovalsSection
              requests={requests}
              currentUserName={currentUser.name}
              onOpenApprovalDetail={(requestId) =>
                setActiveDrawer({ type: "approval-detail", id: requestId })
              }
            />

            <MyBoardsSection
              catalog={catalog}
              currentUserName={currentUser.name}
              onOpenBoardConfig={(accessId) =>
                setActiveDrawer({ type: "board-config", id: accessId })
              }
            />

            <AdminQueueSection
              requests={requests}
              currentUserName={currentUser.name}
              onOpenAdminRequestDetail={(requestId) =>
                setActiveDrawer({ type: "admin-request-detail", id: requestId })
              }
            />

            <AccessIdGovernanceSection queueItems={governanceQueue} />

            <RecentActivitySection logs={auditLogs} />
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
            <div className="flex flex-col gap-4">
              <MyRequestsSection
                requests={requests}
                currentUserName={currentUser.name}
                compact={false}
                onOpenRequestDetail={(requestId) =>
                  setActiveDrawer({ type: "request-detail", id: requestId })
                }
              />
            </div>

            <div className="flex flex-col gap-4">
              <ApprovalsSection
                requests={requests}
                currentUserName={currentUser.name}
                onOpenApprovalDetail={(requestId) =>
                  setActiveDrawer({ type: "approval-detail", id: requestId })
                }
              />
            </div>
          </div>
        )}
      </main>

      {/* Drawers */}
      {activeDrawer?.type === "access-details" && (
        <AccessDetailsDrawer
          accessItem={selectedAccessItem}
          currentUserGroup={currentUser.group}
          isGovernancePending={isGovernancePending}
          onClose={() => setActiveDrawer(null)}
          onRequestAccess={(accessId) =>
            setActiveDrawer({ type: "request-form", id: accessId })
          }
          onRequestException={(accessId) =>
            setActiveDrawer({ type: "exception-form", id: accessId })
          }
          onViewAccessIdStatus={(accessId) =>
            setActiveDrawer({ type: "access-id-status", id: accessId })
          }
        />
      )}

      {activeDrawer?.type === "access-id-status" && (
        <AccessIdStatusDrawer
          accessItem={selectedAccessItem}
          queueItem={selectedQueueItem}
          currentUserName={currentUser.name}
          onClose={() => setActiveDrawer(null)}
          onContinueRequest={(accessId) =>
            setActiveDrawer({ type: "request-form", id: accessId })
          }
        />
      )}

      {activeDrawer?.type === "request-form" && (
        <RequestFormDrawer
          accessItem={selectedAccessItem}
          currentUserName={currentUser.name}
          onClose={() => setActiveDrawer(null)}
        />
      )}

      {activeDrawer?.type === "exception-form" && (
        <ExceptionFormDrawer
          accessItem={selectedAccessItem}
          onClose={() => setActiveDrawer(null)}
          onSubmittedSuccess={(id, accessLabel, approver) => {
            setActiveModal({
              type: "exception-confirm",
              data: { id, accessLabel, approver },
            });
          }}
        />
      )}

      {activeDrawer?.type === "request-detail" && (
        <RequestDetailDrawer
          request={selectedRequest}
          currentUserName={currentUser.name}
          onClose={() => setActiveDrawer(null)}
          onOpenCloseModal={(requestId) =>
            setActiveModal({ type: "close-request", data: { requestId } })
          }
        />
      )}

      {activeDrawer?.type === "approval-detail" && (
        <ApprovalDetailDrawer
          request={selectedRequest}
          currentUserName={currentUser.name}
          onClose={() => setActiveDrawer(null)}
          onOpenRejectModal={(requestId) =>
            setActiveModal({ type: "reject", data: { requestId } })
          }
        />
      )}

      {activeDrawer?.type === "board-config" && (
        <BoardConfigDrawer
          accessItem={selectedAccessItem}
          onClose={() => setActiveDrawer(null)}
        />
      )}

      {activeDrawer?.type === "admin-request-detail" && (
        <AdminRequestDetailDrawer
          request={selectedRequest}
          onClose={() => setActiveDrawer(null)}
        />
      )}

      {/* Modals */}
      {activeModal?.type === "close-request" && (
        <CloseRequestModal
          requestId={activeModal.data.requestId}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setActiveDrawer(null);
          }}
        />
      )}

      {activeModal?.type === "reject" && (
        <RejectModal
          requestId={activeModal.data.requestId}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setActiveDrawer(null);
          }}
        />
      )}

      {activeModal?.type === "exception-confirm" && (
        <ExceptionConfirmModal
          data={activeModal.data}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Toasts */}
      <ToastContainer />
    </div>
  );
}
