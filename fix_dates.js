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
  
  if (!content.includes('import { formatClientDate }')) {
    content = 'import { formatClientDate } from "@/lib/utils";\n' + content;
  }
  
  content = content.replace(/new Date\(([^)]+)\)\.toLocaleDateString\("en-US",\s*\{[^}]+\}\)/g, 'formatClientDate($1)');
  
  fs.writeFileSync(file, content);
}
console.log("Dates fixed");
