import { ref, type Ref } from "vue";

class DevModeClass {
  active: Ref<boolean>;
  constructor(active: boolean) {
    this.active = ref(active);
  }
  get getActive() {
    return this.active;
  }
  set setActive(active: boolean) {
    this.active.value = active;
  }
}

const DevMode = localStorage.getItem("devMode")
  ? new DevModeClass(!!JSON.parse(String(localStorage.getItem("devMode"))))
  : new DevModeClass(false);

export default DevMode;
