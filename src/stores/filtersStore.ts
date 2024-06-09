import { ref } from "vue";
interface IFilters {
  projects?: (string | number)[];
  studios?: (string | number)[];
  offices?: (string | number)[];
  departments?: (string | number)[];
}
const useFiltersStore = () => {
  const filters = ref({
    projects: [],
    studios: [],
    offices: [],
    departments: [],
  });
  const addFilterValues = (data: IFilters) => {
    filters.value = {
      projects: [],
      studios: [],
      offices: [],
      departments: [],
      ...data,
    };
  };

  return { filters, addFilterValues };
};

export default useFiltersStore();
