const fs = require('fs');
const path = require('path');

const srcFile = path.resolve('c:/Users/ramar/OneDrive/Documents/Zyntratechnologies/bank/client/src/pages/admin/AdminDashboard.jsx');
const viewsDir = path.resolve('c:/Users/ramar/OneDrive/Documents/Zyntratechnologies/bank/client/src/components/admin/views');

let content = fs.readFileSync(srcFile, 'utf-8');

const tabs = [
  { tab: 'loan-transfer', name: 'LoanTransferView' },
  { tab: 'bank-rates', name: 'BankRatesView' }
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

tabs.forEach(({ tab, name }) => {
  const block = extractBlock(tab);
  if (!block) return;
  
  const componentContent = `import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../../utils/api';

const ${name} = (props) => {
  const {
    adminUser, stats, selectedBranch, setSelectedBranch,
    applications, filteredApplications, getStatusBadge,
    setActiveTab, setSelectedApplication, showToast,
    customersList, customersPage, setCustomersPage, customersPerPage,
    setSelectedCustomer, setShowCustomerModal,
    disbursementForm, setDisbursementForm, handleDisburseLoanSubmit,
    usersList, setEditingUser, setShowAddUserModal,
    activeSettingsTab, setActiveSettingsTab, currentSettingForm, setCurrentSettingForm, handleSaveSettings,
    locationsList, setEditingLocation, setShowLocationModal, handleRemoveLocation,
    bankRatesList, bankRatesPage, setBankRatesPage, bankRatesPerPage, setEditingBankRate, setShowBankRateModal, setBankRatesList
  } = props;

  ${block.isFunc ? block.jsxContent : `return (\n${block.jsxContent}\n);`}
};

export default ${name};
`;

  fs.writeFileSync(path.join(viewsDir, `${name}.jsx`), componentContent);
  importsToAdd.push(`import ${name} from '../../components/admin/views/${name}';`);

  const replacement = `{activeTab === '${tab}' && <${name} {...commonProps} />}`;
  content = content.substring(0, block.idx) + replacement + content.substring(block.endIdx + 1);
});

const importAnchor = "import RepaymentsView from '../../components/admin/views/RepaymentsView';";
content = content.replace(importAnchor, importAnchor + '\n' + importsToAdd.join('\n'));

// Update commonProps to include the new props used by BankRatesView
const oldProps = "locationsList, setEditingLocation, setShowLocationModal, handleRemoveLocation";
const newProps = oldProps + ",\n    bankRatesList, bankRatesPage, setBankRatesPage, bankRatesPerPage, setEditingBankRate, setShowBankRateModal, setBankRatesList";
content = content.replace(oldProps, newProps);

fs.writeFileSync(srcFile, content);
console.log('Refactoring complete.');
