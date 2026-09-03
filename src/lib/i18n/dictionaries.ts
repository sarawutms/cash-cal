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
      allTime: 'ทั้งหมด'
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
      addTitle: 'เพิ่มรายการใหม่',
      type: 'ประเภท',
      income: 'รายรับ',
      expense: 'รายจ่าย',
      savingType: 'เงินออม',
      date: 'วันที่',
      amount: 'จำนวนเงิน (บาท)',
      category: 'หมวดหมู่',
      description: 'รายละเอียด (ตัวเลือก)',
      save: 'บันทึกรายการ',
      saving: 'กำลังบันทึก...',
      selectPlaceholder: 'เลือกหมวดหมู่',
      recent: 'รายการล่าสุด',
      empty: 'ยังไม่มีรายการ (เพิ่มข้อมูลเพื่อเริ่มต้น!)',
      loginRequired: 'กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล',
      loginToView: 'เข้าสู่ระบบเพื่อดูรายการของคุณ',
      categories: {
        expense: {
          food: 'อาหาร/เครื่องดื่ม',
          transport: 'เดินทาง',
          utilities: 'บิล/สาธารณูปโภค',
          entertainment: 'บันเทิง/สังสรรค์',
          shopping: 'ช้อปปิ้ง',
          other: 'อื่นๆ'
        },
        income: {
          salary: 'เงินเดือน',
          freelance: 'อาชีพอิสระ',
          investment: 'การลงทุน',
          gift: 'ของขวัญ',
          bonus: 'โบนัส',
          initial_balance: 'ยอดยกมา',
          other: 'อื่นๆ',
        },
        saving: {
          bank: 'เงินฝากธนาคาร',
          investment: 'ลงทุน/กองทุน/หุ้น',
          crypto: 'คริปโต/สินทรัพย์ดิจิทัล',
          piggy_bank: 'กระปุกออมสิน',
          other: 'อื่นๆ'
        }
      }
    },
    auth: {
      title: 'เข้าสู่ระบบ / สมัครสมาชิก',
      desc: 'กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลของคุณ',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      loginBtn: 'เข้าสู่ระบบ',
      signupBtn: 'สมัครสมาชิก',
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
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
      allTime: 'All Time'
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
      type: 'Type',
      income: 'Income',
      expense: 'Expense',
      savingType: 'Savings',
      date: 'Date',
      amount: 'Amount',
      category: 'Category',
      description: 'Description (Optional)',
      save: 'Save Transaction',
      saving: 'Saving...',
      selectPlaceholder: 'Select Category',
      recent: 'Recent Transactions',
      empty: 'No transactions yet (add one to start!)',
      loginRequired: 'Please login to add transactions',
      loginToView: 'Login to view your transactions',
      categories: {
        expense: {
          food: 'Food & Drinks',
          transport: 'Transport',
          utilities: 'Utilities & Bills',
          entertainment: 'Entertainment',
          shopping: 'Shopping',
          other: 'Other'
        },
        income: {
          salary: 'Salary',
          freelance: 'Freelance',
          investment: 'Investment',
          gift: 'Gift',
          bonus: 'Bonus',
          initial_balance: 'Initial Balance',
          other: 'Other'
        },
        saving: {
          bank: 'Bank Deposit',
          investment: 'Investment/Stocks',
          crypto: 'Crypto',
          piggy_bank: 'Piggy Bank',
          other: 'Other'
        }
      }
    },
    auth: {
      title: 'Welcome to CashCal',
      desc: 'Sign in to manage your finances',
      email: 'Email',
      password: 'Password',
      loginBtn: 'Log in',
      signupBtn: 'Sign up',
      error: 'Invalid email or password',
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
