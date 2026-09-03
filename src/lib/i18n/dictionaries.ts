import 'server-only'

const dictionaries = {
  th: {
    app: {
      title: 'บันทึกรับ-จ่าย',
      subtitle: 'จัดการการเงินของคุณ',
      login: 'เข้าสู่ระบบ',
      logout: 'ออกจากระบบ',
      language: 'ภาษา',
      welcome: 'ยินดีต้อนรับ',
    },
    dashboard: {
      balance: 'ยอดเงินคงเหลือ',
      income: 'รายรับรวม',
      expense: 'รายจ่ายรวม',
      saving: 'เงินออมรวม',
      today: 'วันนี้',
      thisWeek: 'สัปดาห์นี้',
      thisMonth: 'เดือนนี้',
      thisYear: 'ปีนี้',
      allTime: 'ทั้งหมด',
      analytics: 'กราฟวิเคราะห์',
      budgetTitle: 'งบประมาณรายเดือน',
      setBudget: 'ตั้งงบประมาณ',
      noBudget: 'ยังไม่ได้ตั้งงบประมาณ กดไอคอน ✏️ เพื่อตั้งค่า',
      overBudget: 'คุณใช้จ่ายเกินงบประมาณที่ตั้งไว้แล้ว!',
    },
    tabs: {
      calendar: 'มุมมองปฏิทิน',
      list: 'มุมมองตาราง',
    },
    calendar: {
      today: 'วันนี้',
      transactionsOnDay: 'รายการของวันนี้',
      noTransactions: 'ไม่มีรายการในวันนี้',
      weekdays: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
      months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    },
    transaction: {
      addTitle: 'เพิ่มรายการ',
      editTitle: 'แก้ไขรายการ',
      type: 'ประเภท',
      income: 'รายรับ',
      expense: 'รายจ่าย',
      savingType: 'เงินออม',
      broughtForward: 'ยอดยกมา (เงินโอนเข้า)',
      date: 'วันที่',
      amount: 'จำนวนเงิน',
      category: 'หมวดหมู่',
      description: 'รายละเอียด (ไม่บังคับ)',
      save: 'บันทึกรายการ',
      update: 'อัปเดตรายการ',
      saving: 'กำลังบันทึก...',
      selectPlaceholder: 'เลือกหมวดหมู่',
      recent: 'รายการล่าสุด',
      empty: 'ยังไม่มีรายการ (เพิ่มรายการแรกเลย!)',
      loginRequired: 'กรุณาเข้าสู่ระบบเพื่อเพิ่มรายการ',
      loginToView: 'เข้าสู่ระบบเพื่อดูรายการของคุณ',
      categories: {
        expense: {
          food: 'อาหาร',
          transport: 'เดินทาง',
          shopping: 'ช้อปปิ้ง',
          bills: 'บิล/ค่าสาธารณูปโภค',
          entertainment: 'บันเทิง',
          health: 'สุขภาพ',
          other: 'อื่นๆ'
        },
        income: {
          salary: 'เงินเดือน',
          freelance: 'ฟรีแลนซ์',
          investment: 'การลงทุน',
          other: 'อื่นๆ'
        },
        saving: {
          bank: 'ฝากธนาคาร',
          investment: 'ลงทุน/หุ้น',
          crypto: 'คริปโต',
          piggybank: 'หยอดกระปุก'
        },
        brought_forward: {
          transfer: 'โอนจากบัญชีอื่น',
          initial: 'เงินตั้งต้น'
        }
      }
    },
    auth: {
      title: 'เข้าสู่ระบบ / สมัครสมาชิก',
      desc: 'กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลของคุณ',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      confirmPassword: 'ยืนยันรหัสผ่าน',
      displayName: 'ชื่อที่แสดง',
      displayNamePlaceholder: 'Name',
      loginTab: 'เข้าสู่ระบบ',
      signupTab: 'สมัครสมาชิก',
      loginBtn: 'เข้าสู่ระบบ',
      signupBtn: 'สมัครสมาชิก',
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      passwordMismatch: 'รหัสผ่านไม่ตรงกัน',
    },
    data: {
      export: 'ส่งออก CSV',
      import: 'นำเข้า CSV',
      importSuccess: 'นำเข้าข้อมูลสำเร็จ {count} รายการ',
      importError: 'นำเข้าข้อมูลไม่สำเร็จ',
      confirmImport: 'พบข้อมูล {count} รายการ ต้องการนำเข้าหรือไม่?'
    }
  },
  en: {
    app: {
      title: 'CashCal',
      subtitle: 'Manage your finances',
      login: 'Log in',
      logout: 'Sign out',
      language: 'Language',
      welcome: 'Welcome',
    },
    dashboard: {
      balance: 'Total Balance',
      income: 'Total Income',
      expense: 'Total Expenses',
      saving: 'Total Savings',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisYear: 'This Year',
      allTime: 'All Time',
      analytics: 'Analytics',
      budgetTitle: 'Monthly Budget',
      setBudget: 'Set Budget',
      noBudget: 'No budget set. Click the ✏️ icon to set one.',
      overBudget: 'You have exceeded your monthly budget!',
    },
    tabs: {
      calendar: 'Calendar View',
      list: 'List View',
    },
    calendar: {
      today: 'Today',
      transactionsOnDay: 'Transactions on this day',
      noTransactions: 'No transactions for this date.',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    transaction: {
      addTitle: 'Add Transaction',
      editTitle: 'Edit Transaction',
      type: 'Type',
      income: 'Income',
      expense: 'Expense',
      savingType: 'Savings',
      broughtForward: 'Brought Forward (Transfer In)',
      date: 'Date',
      amount: 'Amount',
      category: 'Category',
      description: 'Description (Optional)',
      save: 'Save Transaction',
      update: 'Update Transaction',
      saving: 'Saving...',
      selectPlaceholder: 'Select Category',
      recent: 'Recent Transactions',
      empty: 'No transactions yet (add one to start!)',
      loginRequired: 'Please login to add transactions',
      loginToView: 'Login to view your transactions',
      categories: {
        expense: {
          food: 'Food',
          transport: 'Transport',
          shopping: 'Shopping',
          bills: 'Bills',
          entertainment: 'Entertainment',
          health: 'Health',
          other: 'Other'
        },
        income: {
          salary: 'Salary',
          freelance: 'Freelance',
          investment: 'Investment',
          other: 'Other'
        },
        saving: {
          bank: 'Bank Account',
          investment: 'Investment/Stocks',
          crypto: 'Crypto',
          piggybank: 'Piggy Bank'
        },
        brought_forward: {
          transfer: 'Transfer from other account',
          initial: 'Initial Balance'
        }
      }
    },
    auth: {
      title: 'Welcome to CashCal',
      desc: 'Sign in to manage your finances',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      displayName: 'Display Name',
      displayNamePlaceholder: 'Name',
      loginTab: 'Login',
      signupTab: 'Sign Up',
      loginBtn: 'Log in',
      signupBtn: 'Sign up',
      error: 'Invalid email or password',
      passwordMismatch: 'Passwords do not match',
    },
    data: {
      export: 'Export CSV',
      import: 'Import CSV',
      importSuccess: 'Successfully imported {count} transactions',
      importError: 'Failed to import data',
      confirmImport: 'This will import {count} transactions. Proceed?'
    }
  }
}

export type Dictionary = typeof dictionaries['th']

export const getDictionary = async (locale: 'th' | 'en') => dictionaries[locale]
