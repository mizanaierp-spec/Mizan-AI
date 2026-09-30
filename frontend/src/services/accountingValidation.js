export function validateJournalLines(lines) {
  if (!Array.isArray(lines) || lines.length < 2) {
    return { valid: false, message: 'يجب أن يحتوي القيد على سطرين على الأقل' };
  }

  let debit = 0;
  let credit = 0;

  for (const line of lines) {
    const lineDebit = Number(line.debit || 0);
    const lineCredit = Number(line.credit || 0);

    if (!Number.isFinite(lineDebit) || !Number.isFinite(lineCredit)) {
      return { valid: false, message: 'قيم المدين والدائن يجب أن تكون أرقاماً صحيحة' };
    }

    if (lineDebit < 0 || lineCredit < 0 || (lineDebit > 0 && lineCredit > 0)) {
      return { valid: false, message: 'كل سطر يجب أن يكون مديناً أو دائناً فقط وبقيمة غير سالبة' };
    }

    if (!line.account_id) {
      return { valid: false, message: 'يجب اختيار الحساب لكل سطر' };
    }

    debit += lineDebit;
    credit += lineCredit;
  }

  if (debit <= 0 || credit <= 0) {
    return { valid: false, message: 'يجب إدخال مبلغ مدين ودائن' };
  }

  const difference = Math.round((debit - credit) * 100) / 100;
  if (Math.abs(difference) > 0.01) {
    return { valid: false, message: `القيد غير متوازن. الفرق: ${difference}` };
  }

  return { valid: true, debit, credit };
}
