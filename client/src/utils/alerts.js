import Swal from 'sweetalert2';

// Dynamically determine SweetAlert2 theme styles based on document theme class
const getSwalConfig = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    background: isDark ? '#13102a' : '#ffffff',
    color: isDark ? '#f0edff' : '#1e1b4b',
    confirmButtonColor: 'var(--accent, #7c3aed)',
    cancelButtonColor: isDark ? '#2d2860' : '#cbd5e1',
    customClass: {
      popup: `rounded-2xl border ${isDark ? 'border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : 'border-slate-200 shadow-xl'} font-sans`,
      title: 'font-bold text-lg text-primary',
      htmlContainer: 'text-sm font-medium',
      confirmButton: 'px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500',
      cancelButton: `px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-transparent focus:outline-none ${isDark ? 'text-slate-350 hover:bg-slate-850' : 'text-slate-700 hover:bg-slate-100'}`
    },
    buttonsStyling: true
  };
};

export const showAlert = (title, text, icon = 'info') => {
  const config = getSwalConfig();
  return Swal.fire({
    title,
    text,
    icon,
    ...config,
    confirmButtonText: 'OK'
  });
};

export const showSuccess = (title, text) => showAlert(title, text, 'success');
export const showError = (title, text) => showAlert(title, text, 'error');
export const showWarning = (title, text) => showAlert(title, text, 'warning');

export const confirmAction = async (title, text, confirmButtonText = 'Yes, delete', cancelButtonText = 'Cancel') => {
  const config = getSwalConfig();
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    ...config
  });
  return result.isConfirmed;
};
