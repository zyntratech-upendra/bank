const fs = require('fs');
const path = require('path');

const srcFile = path.resolve('c:/Users/ramar/OneDrive/Documents/Zyntratechnologies/bank/client/src/pages/admin/AdminDashboard.jsx');
const viewsDir = path.resolve('c:/Users/ramar/OneDrive/Documents/Zyntratechnologies/bank/client/src/components/admin/views');

if (!fs.existsSync(viewsDir)) {
  fs.mkdirSync(viewsDir, { recursive: true });
}

let content = fs.readFileSync(srcFile, 'utf-8');

const tabs = [
  { tab: 'dashboard', name: 'DashboardOverviewView' },
  { tab: 'applications', name: 'ApplicationsView' },
  { tab: 'kyc', name: 'KycDocumentsView' },
  { tab: 'customers', name: 'CustomersView' },
  { tab: 'gold-loan', name: 'GoldLoanView' },
  { tab: 'disbursements', name: 'DisbursementsView' },
  { tab: 'reports', name: 'ReportsView' },
  { tab: 'users-roles', name: 'UsersRolesView' },
  { tab: 'settings', name: 'SettingsView' },
  { tab: 'locations', name: 'LocationsView' },
  { tab: 'branch-operations', name: 'BranchOperationsView' },
  { tab: 'one-lending', name: 'OneLendingView' },
  { tab: 'repayments', name: 'RepaymentsView' }
];

function extractBlock(tab) {
  const pattern1 = `{activeTab === '${tab}' && (`;
  const pattern2 = `{activeTab === '${tab}' && (() => {`;
  let idx = content.indexOf(pattern1);
  let isFunc = false;
  let startPattern = pattern1;
  if (idx === -1) {
    idx = content.indexOf(pattern2);
    isFunc = true;
    startPattern = pattern2;
  }
  
  // In some cases the kyc tab has multiple occurrences due to duplicate code?
  // Let's find all occurrences and extract them sequentially if they exist. Wait, the main activeTab checks are top-level.
  if (idx === -1) return null;

  let braceCount = 0;
  let endIdx = -1;
  for (let i = idx; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0) {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) return null;

  const originalBlock = content.substring(idx, endIdx + 1);
  let jsxContent = originalBlock;
  if (isFunc) {
     jsxContent = jsxContent.substring(startPattern.length, jsxContent.length - 5).trim();
  } else {
     jsxContent = jsxContent.substring(startPattern.length, jsxContent.length - 2).trim();
  }

  return { idx, endIdx, originalBlock, jsxContent, isFunc };
}

const importsToAdd = [];

// Handle duplicate tabs! e.g. activeTab === 'kyc' appears twice maybe? (There was a comment "12. KYC & DOCUMENTS VIEW" and "3. KYC & DOCUMENTS VIEW")
// To be safe, loop until not found.
tabs.forEach(({ tab, name }) => {
  let count = 0;
  while (true) {
    const block = extractBlock(tab);
    if (!block) break;
    
    count++;
    const compName = count > 1 ? `${name}${count}` : name;
    
    const componentContent = `import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ${compName} = (props) => {
  const {
    adminUser, stats, selectedBranch, setSelectedBranch,
    applications, filteredApplications, getStatusBadge,
    setActiveTab, setSelectedApplication, showToast,
    customersList, customersPage, setCustomersPage, customersPerPage,
    setSelectedCustomer, setShowCustomerModal,
    disbursementForm, setDisbursementForm, handleDisburseLoanSubmit,
    usersList, setEditingUser, setShowAddUserModal,
    activeSettingsTab, setActiveSettingsTab, currentSettingForm, setCurrentSettingForm, handleSaveSettings,
    locationsList, setEditingLocation, setShowLocationModal, handleRemoveLocation
  } = props;

  ${block.isFunc ? block.jsxContent : `return (\n${block.jsxContent}\n);`}
};

export default ${compName};
`;

    fs.writeFileSync(path.join(viewsDir, `${compName}.jsx`), componentContent);
    importsToAdd.push(`import ${compName} from '../../components/admin/views/${compName}';`);

    const replacement = `{activeTab === '${tab}' && <${compName} {...commonProps} />}`;
    content = content.substring(0, block.idx) + replacement + content.substring(block.endIdx + 1);
  }
});

const importAnchor = "import ServiceRequestsView from '../../components/admin/ServiceRequestsView';";
content = content.replace(importAnchor, importAnchor + '\n' + importsToAdd.join('\n'));

const commonPropsDef = `
  const commonProps = {
    adminUser, stats, selectedBranch, setSelectedBranch,
    applications, filteredApplications, getStatusBadge,
    setActiveTab, setSelectedApplication, showToast,
    customersList, customersPage, setCustomersPage, customersPerPage,
    setSelectedCustomer, setShowCustomerModal,
    disbursementForm, setDisbursementForm, handleDisburseLoanSubmit,
    usersList, setEditingUser, setShowAddUserModal,
    activeSettingsTab, setActiveSettingsTab, currentSettingForm, setCurrentSettingForm, handleSaveSettings,
    locationsList, setEditingLocation, setShowLocationModal, handleRemoveLocation
  };
`;
const renderStartIdx = content.indexOf('return (');
content = content.substring(0, renderStartIdx) + commonPropsDef + '\n  ' + content.substring(renderStartIdx);

fs.writeFileSync(srcFile, content);
console.log('Refactoring complete.');
