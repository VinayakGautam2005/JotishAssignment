import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string) {
  // Basic formatter, assuming input is like "$320,800"
  // If it's just a number string, we can format it properly
  if (amount.startsWith('$')) return amount;
  
  const num = parseFloat(amount.replace(/,/g, ''));
  if (isNaN(num)) return amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

export function parseSalary(salaryString: string): number {
  // Remove '$' and ',' then parse
  return parseFloat(salaryString.replace(/[^0-9.-]+/g, ""));
}
