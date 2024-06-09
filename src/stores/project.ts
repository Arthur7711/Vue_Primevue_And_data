import { ref } from "vue";

const useProjectStore = () => {
  const milestoneId = ref("");
  const contactMailDevCreatives = ref('')
  const changeMilestoneId = (id: string) => {
    milestoneId.value = id;
  };
  const changeContactMailDevCreatives = (contacts: string) => {
    contactMailDevCreatives.value = contacts;
  };
  const milestoneName = ref("");
  const changeMilestoneName = (name: string) => {
    milestoneName.value = name;
  };
  const title = ref("");
  const changeTitle = (newTitle: string) => {
    title.value = newTitle;
  };
  const updateCount = ref(0);
  const changeUpdateCount = () => {
    updateCount.value += 1;
  };
  return {
    milestoneId,
    changeContactMailDevCreatives,
    contactMailDevCreatives,
    changeMilestoneId,
    title,
    changeTitle,
    milestoneName,
    changeMilestoneName,
    changeUpdateCount,
    updateCount,
  };
};

export default useProjectStore();
