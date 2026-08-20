const fs = require('fs');
const files = [
  "components/drawers/ApprovalDetailDrawer.tsx",
  "components/drawers/RequestDetailDrawer.tsx",
  "components/drawers/AdminRequestDetailDrawer.tsx",
  "components/layout/Header.tsx",
  "components/dashboard/MyRequestsSection.tsx",
  "components/dashboard/ApprovalsSection.tsx",
  "components/dashboard/RecentActivitySection.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.startsWith('import { formatClientDate } from "@/lib/utils";\n"use client";')) {
    content = content.replace('import { formatClientDate } from "@/lib/utils";\n"use client";', '"use client";\nimport { formatClientDate } from "@/lib/utils";');
    fs.writeFileSync(file, content);
  }
}
console.log("Imports fixed");
