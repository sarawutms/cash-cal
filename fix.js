const fs = require('fs');

function fixFile(f) {
  if (fs.existsSync(f)) {
    let text = fs.readFileSync(f, 'utf8');
    // DashboardSummary
    text = text.replace(/>\s*a\+\+\s*\{/g, '>฿{');
    text = text.replace(/\} a\+\+\{/g, '} ฿{');
    
    // ExpenseChart
    text = text.replace(/`\?\$\{/g, '`฿${');
    text = text.replace(/`,\$\{/g, '`฿${'); // if it was ,

    // In general, replacing specific mangled things:
    text = text.replace(/"\?\$\{/g, '"฿${');
    text = text.replace(/>\?\s*\{/g, '>฿{');

    // Also just look for a++ where it shouldn't be
    text = text.replace(/a\+\+/g, '฿');
    
    fs.writeFileSync(f, text, 'utf8');
  }
}

fixFile('src/components/transactions/dashboard-summary.tsx');
fixFile('src/components/transactions/expense-chart.tsx');
fixFile('src/components/transactions/transaction-list.tsx');
fixFile('src/components/transactions/calendar-view.tsx');
console.log('Fixed');
