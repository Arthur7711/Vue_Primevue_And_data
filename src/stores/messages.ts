import { ref } from "vue";

const useErrorStore = () => {
  const errorText = ref("");
  const showError = ref(false);
  const changeErrorText = (text: string) => {
    errorText.value = text;
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  };
  const successText = ref("");
  const showSuccess = ref(false);
  const changeSuccessText = (text: string) => {
    successText.value = text;
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  };

  return {
    errorText,
    changeErrorText,
    showError,
    successText,
    showSuccess,
    changeSuccessText,
  };
};

export default useErrorStore();
