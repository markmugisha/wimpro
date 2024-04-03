const toastConfig = {
  duration: 3000,
  position: 'top-right',
  variant: 'subtle',
};

const errorToast = (title, description) => ({
  title,
  description,
  status: 'error',
  ...toastConfig,
});

const successToast = (title, description) => ({
  title,
  description,
  status: 'success',
  ...toastConfig,
});

export { errorToast, successToast };
