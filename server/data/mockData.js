const initialUsers = [
  {
    _id: "65f000000000000000000001",
    id: "USR001",
    name: "Ravi Kumar",
    email: "admin@bankingservices.com",
    role: "admin",
    title: "Branch Manager",
    branch: "Vijayawada",
    phone: "+91 98480 12345",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
  },
  {
    _id: "65f000000000000000000002",
    id: "USR002",
    name: "Sita Reddy",
    email: "sita.reddy@bankingservices.com",
    role: "officer",
    title: "Branch Staff",
    branch: "Vijayawada",
    phone: "+91 98480 23456",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
  },
  {
    _id: "65f000000000000000000003",
    id: "USR003",
    name: "Anil Mehta",
    email: "anil.mehta@bankingservices.com",
    role: "officer",
    title: "KYC Officer",
    branch: "Vijayawada",
    phone: "+91 98480 34567",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
  },
  {
    _id: "65f000000000000000000004",
    id: "USR004",
    name: "Priya Sharma",
    email: "priya.sharma@bankingservices.com",
    role: "officer",
    title: "Operations Executive",
    branch: "Vijayawada",
    phone: "+91 98480 45678",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
  },
  {
    _id: "65f000000000000000000005",
    id: "USR005",
    name: "Karthik",
    email: "karthik@bankingservices.com",
    role: "officer",
    title: "Collections Executive",
    branch: "Vijayawada",
    phone: "+91 98480 56789",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250"
  }
];

const initialApplications = [
  {
    _id: "65f100000000000000000001",
    applicationId: "APP2026001",
    applicantName: "Suresh Babu",
    applicantMobile: "+91 98765 43210",
    applicantEmail: "sureshbabu@gmail.com",
    dateOfBirth: "15 Jan 1988",
    address: "12-3-45, MG Road, Vijayawada, AP",
    loanType: "Gold Loan",
    amount: 300000,
    interestRate: 8.5,
    loanTenure: 12,
    purpose: "Personal",
    submittedOn: "24 Sep 2026, 10:30 AM",
    status: "KYC Pending",
    assignedTo: "Ravi Kumar",
    branch: "Vijayawada",
    goldDetails: {
      weightGrams: 50,
      carat: 22,
      estimatedValue: 350000,
      ornamentType: "Gold Bangles & Chain"
    },
    bankDetails: {
      accountNumber: "XXXXXX1234",
      bankName: "State Bank of India",
      ifsc: "SBIN0001234"
    },
    documents: [
      { id: "doc-1", type: "Aadhaar Card", fileName: "suresh_aadhaar.pdf", status: "Verified", remarks: "-", uploadedOn: "24 Sep 2026" },
      { id: "doc-2", type: "PAN Card", fileName: "suresh_pan.pdf", status: "Verified", remarks: "-", uploadedOn: "24 Sep 2026" },
      { id: "doc-3", type: "Address Proof", fileName: "address_proof.pdf", status: "Pending", remarks: "Need clear copy", uploadedOn: "24 Sep 2026" },
      { id: "doc-4", type: "Gold Invoice / Ornament Photo", fileName: "gold_photo.jpg", status: "Pending", remarks: "Need better image", uploadedOn: "24 Sep 2026" }
    ],
    kycCompleted: false,
    disbursementDetails: {
      disbursedAmount: 300000,
      disbursementDate: "24/09/2026",
      repaymentMode: "Monthly EMI",
      firstEmiDate: "24/10/2026",
      monthlyEmi: 26663,
      bankAccount: "XXXXXX1234 - SBI",
      remarks: "Ready for processing upon KYC resolution",
      isDisbursed: false
    },
    comments: [
      { author: "Ravi Kumar", role: "Branch Manager", text: "Customer visited branch. Physical verification pending for jewelry.", date: "24 Sep 2026, 11:00 AM" }
    ],
    history: [
      { action: "Application Submitted", by: "Suresh Babu", date: "24 Sep 2026, 10:30 AM" },
      { action: "Assigned to Ravi Kumar", by: "System", date: "24 Sep 2026, 10:32 AM" },
      { action: "Aadhaar & PAN Verified", by: "Anil Mehta", date: "24 Sep 2026, 11:15 AM" }
    ]
  },
  {
    _id: "65f100000000000000000002",
    applicationId: "APP2026002",
    applicantName: "Divya Nair",
    applicantMobile: "+91 91234 56789",
    applicantEmail: "divya.nair@gmail.com",
    dateOfBirth: "22 Aug 1993",
    address: "Plot 89, Gayatri Nagar, Vijayawada, AP",
    loanType: "One Lending",
    amount: 250000,
    interestRate: 9.2,
    loanTenure: 24,
    purpose: "Home Renovation",
    submittedOn: "24 Sep 2026",
    status: "Under Review",
    assignedTo: "Anil Mehta",
    branch: "Vijayawada",
    goldDetails: { weightGrams: 0, carat: 0, estimatedValue: 0, ornamentType: "N/A" },
    bankDetails: { accountNumber: "XXXXXX9876", bankName: "HDFC Bank", ifsc: "HDFC0004321" },
    documents: [
      { id: "doc-1", type: "Aadhaar Card", fileName: "divya_aadhaar.pdf", status: "Verified", remarks: "Valid UIDAI", uploadedOn: "24 Sep 2026" },
      { id: "doc-2", type: "PAN Card", fileName: "divya_pan.pdf", status: "Verified", remarks: "Verified with IT Dept", uploadedOn: "24 Sep 2026" },
      { id: "doc-3", type: "Bank Statement", fileName: "salary_statement_6m.pdf", status: "Pending", remarks: "Checking credit transactions", uploadedOn: "24 Sep 2026" }
    ],
    kycCompleted: true,
    disbursementDetails: { disbursedAmount: 0, isDisbursed: false },
    comments: [],
    history: [{ action: "Application Submitted", by: "Divya Nair", date: "24 Sep 2026" }]
  },
  {
    _id: "65f100000000000000000003",
    applicationId: "APP2026003",
    applicantName: "Mohan Rao",
    applicantMobile: "+91 98765 44556",
    applicantEmail: "mohan.rao@outlook.com",
    dateOfBirth: "04 Mar 1982",
    address: "Flat 402, Royal Enclave, Benz Circle, Vijayawada, AP",
    loanType: "Loan Transfer",
    amount: 500000,
    interestRate: 8.0,
    loanTenure: 36,
    purpose: "Balance Transfer to Low Interest",
    submittedOn: "24 Sep 2026",
    status: "Document Pending",
    assignedTo: "Sita Reddy",
    branch: "Vijayawada",
    goldDetails: { weightGrams: 80, carat: 22, estimatedValue: 560000, ornamentType: "Necklace and bangles" },
    bankDetails: { accountNumber: "XXXXXX5544", bankName: "ICICI Bank", ifsc: "ICIC0009876" },
    documents: [
      { id: "doc-1", type: "Aadhaar Card", fileName: "mohan_aadhaar.pdf", status: "Verified", remarks: "-", uploadedOn: "24 Sep 2026" },
      { id: "doc-2", type: "Existing Loan Statement", fileName: "previous_bank_loan.pdf", status: "Pending", remarks: "Foreclosure letter required", uploadedOn: "24 Sep 2026" }
    ],
    kycCompleted: false,
    disbursementDetails: { disbursedAmount: 0, isDisbursed: false },
    comments: [],
    history: [{ action: "Application Submitted", by: "Mohan Rao", date: "24 Sep 2026" }]
  },
  {
    _id: "65f100000000000000000004",
    applicationId: "APP2026004",
    applicantName: "Lakshmi Devi",
    applicantMobile: "+91 90123 44556",
    applicantEmail: "lakshmi.devi@gmail.com",
    dateOfBirth: "12 Oct 1978",
    address: "Door 4-21, Governorpet, Vijayawada, AP",
    loanType: "Gold Loan",
    amount: 100000,
    interestRate: 8.5,
    loanTenure: 12,
    purpose: "Agriculture / Medical",
    submittedOn: "23 Sep 2026",
    status: "Approved",
    assignedTo: "Ravi Kumar",
    branch: "Vijayawada",
    goldDetails: { weightGrams: 25, carat: 22, estimatedValue: 152000, ornamentType: "Gold Chain" },
    bankDetails: { accountNumber: "XXXXXX7788", bankName: "Canara Bank", ifsc: "CNRB0002134" },
    documents: [
      { id: "doc-1", type: "Aadhaar Card", fileName: "lakshmi_aadhaar.pdf", status: "Verified", remarks: "OK", uploadedOn: "23 Sep 2026" },
      { id: "doc-2", type: "PAN Card", fileName: "lakshmi_pan.pdf", status: "Verified", remarks: "OK", uploadedOn: "23 Sep 2026" },
      { id: "doc-3", type: "Ornament Valuation", fileName: "val_sheet.pdf", status: "Verified", remarks: "Purity 91.6% confirmed", uploadedOn: "23 Sep 2026" }
    ],
    kycCompleted: true,
    disbursementDetails: {
      disbursedAmount: 100000,
      disbursementDate: "24/09/2026",
      repaymentMode: "Monthly EMI",
      firstEmiDate: "24/10/2026",
      monthlyEmi: 8722,
      bankAccount: "XXXXXX7788 - Canara Bank",
      remarks: "Approved for disbursement",
      isDisbursed: false
    },
    comments: [],
    history: [{ action: "Approved by Ravi Kumar", by: "Ravi Kumar", date: "24 Sep 2026, 09:15 AM" }]
  },
  {
    _id: "65f100000000000000000005",
    applicationId: "APP2026005",
    applicantName: "Arjun Patel",
    applicantMobile: "+91 98765 22534",
    applicantEmail: "arjun.patel@gmail.com",
    dateOfBirth: "19 Dec 1991",
    address: "7-1-88, Labbipet, Vijayawada, AP",
    loanType: "One Lending",
    amount: 400000,
    interestRate: 8.0,
    loanTenure: 24,
    purpose: "Business Expansion",
    submittedOn: "22 Sep 2026",
    status: "Rejected",
    assignedTo: "Anil Mehta",
    branch: "Vijayawada",
    goldDetails: { weightGrams: 0, carat: 0, estimatedValue: 0, ornamentType: "N/A" },
    bankDetails: { accountNumber: "XXXXXX3322", bankName: "Axis Bank", ifsc: "UTIB0001122" },
    documents: [
      { id: "doc-1", type: "Selfie / Photo", fileName: "arjun_photo.jpg", status: "Verified", remarks: "Match", uploadedOn: "22 Sep 2026" }
    ],
    kycCompleted: false,
    disbursementDetails: { disbursedAmount: 0, isDisbursed: false },
    comments: [{ author: "Anil Mehta", role: "KYC Officer", text: "Low credit score and insufficient repayment records.", date: "23 Sep 2026" }],
    history: [{ action: "Rejected", by: "Anil Mehta", date: "23 Sep 2026" }]
  }
];

const initialSettings = [
  {
    loanType: "Gold Loan",
    interestRate: 8.5,
    processingFee: 1.0,
    minAmount: 10000,
    maxAmount: 5000000,
    tenure: "3 - 36 Months",
    prepaymentCharges: 0.5,
    enableLatePayment: true,
    enableGoldStorage: true,
    enableInsurance: true,
    enableGst: true
  },
  {
    loanType: "Loan Transfer",
    interestRate: 8.0,
    processingFee: 0.5,
    minAmount: 50000,
    maxAmount: 10000000,
    tenure: "6 - 60 Months",
    prepaymentCharges: 0.0,
    enableLatePayment: true,
    enableGoldStorage: false,
    enableInsurance: true,
    enableGst: true
  },
  {
    loanType: "One Lending",
    interestRate: 9.5,
    processingFee: 1.5,
    minAmount: 25000,
    maxAmount: 2500000,
    tenure: "6 - 48 Months",
    prepaymentCharges: 1.0,
    enableLatePayment: true,
    enableGoldStorage: false,
    enableInsurance: true,
    enableGst: true
  },
  {
    loanType: "Personal Loan",
    interestRate: 10.5,
    processingFee: 2.0,
    minAmount: 20000,
    maxAmount: 1500000,
    tenure: "12 - 60 Months",
    prepaymentCharges: 2.0,
    enableLatePayment: true,
    enableGoldStorage: false,
    enableInsurance: true,
    enableGst: true
  },
  {
    loanType: "Business Loan",
    interestRate: 11.0,
    processingFee: 2.0,
    minAmount: 100000,
    maxAmount: 20000000,
    tenure: "12 - 84 Months",
    prepaymentCharges: 1.5,
    enableLatePayment: true,
    enableGoldStorage: false,
    enableInsurance: true,
    enableGst: true
  }
];

const initialLocations = [
  {
    id: "LOC001",
    city: "Vijayawada",
    address: "12-3-45, MG Road, Vijayawada, AP",
    contact: "+91 98480 12345",
    services: ["Gold Loan", "Loan Transfer", "One Lending"]
  },
  {
    id: "LOC002",
    city: "Hyderabad",
    address: "Plot 89, Banjara Hills, Hyderabad, TS",
    contact: "+91 98480 23456",
    services: ["Gold Loan", "Personal Loan", "Business Loan"]
  },
  {
    id: "LOC003",
    city: "Guntur",
    address: "Door 4-21, Brodipet, Guntur, AP",
    contact: "+91 98480 34567",
    services: ["Gold Loan", "Loan Transfer"]
  }
];

module.exports = {
  initialUsers,
  initialApplications,
  initialSettings,
  initialLocations
};
