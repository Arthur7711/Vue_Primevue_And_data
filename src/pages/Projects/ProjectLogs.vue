<template>
  <ProjectTabs>
    <template #logs>
      <div class="form-comment">
        <h3>Add comment</h3>

        <div class="input-container">
          <textarea
            class="input-comment"
            v-model="comment"
            placeholder="Comment here..."
          ></textarea>
        </div>

        <div class="button-container">
          <button
            class="button-comment"
            :class="{'disabled': !comment || is_loading}"
            @click="handleSubmitComment"
            :disabled="!comment || is_loading"
          >Submit</button>
        </div>
      </div>

      <br>

      <h3>Logs table</h3>
      
      <a-table
        class="project_logs_table"
        :data-source="logsList"
        :columns="columns"
        :pagination="false"
        :scroll="{y: 600}"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'user'">
            <template v-if="text !== null">
              <a
                :href="`/staff/${text.id}`"
              >
                <img
                  class="avatar_url"
                  :alt="text.displayname"
                  :src="text.avatar_url"
                >
              </a>
            </template>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <CustomTag :type="text">{{ text }}</CustomTag>
          </template>
          <template v-else-if="column.dataIndex === 'field'">
            <CustomTag>{{ text }}</CustomTag>
          </template>
          <template v-else>
            <span class="content">{{ text }}</span>
          </template>
        </template>
      </a-table>
    </template>
  </ProjectTabs>
</template>

<script lang="ts">

import {getProjectLogs, addProjectComment} from "@/api/projects";
import {IProjectLog} from "@/api/models/IProjects";
import {fillTableLine} from "@/utils";
import CustomTag from "@/components/CustomTag.vue";
import {IResponseMeta} from "@/api/models/IResponse";

const ACTIONS = {
  CREATED: 'Created',
  EDITED: 'Edited',
  DELETED: 'Deleted',
}

export default {
  name: 'ProjectLogs',

  components: {
    CustomTag
  },

  mounted() {
    this.loadNextPage();

    document.querySelector('.ant-table-body').onscroll = this.handleScroll;
  },

  data() {
    return {
      comment: '',
      next_page: 1,
      last_page: 1,
      is_loading: false,
      logs: [],
      columns: [
        fillTableLine('', 'user', {width: "60px"}),
        fillTableLine('Field', 'field'),
        fillTableLine('Action', 'action'),
        fillTableLine('Value', 'value'),
        fillTableLine('', 'value_operation'),
        fillTableLine('', 'value_after'),
        fillTableLine('Date (UTC)', 'date'),
      ],
    }
  },

  methods: {
    handleSubmitComment: async function () {
      this.is_loading = true;

      try {
        const {meta, data} = await addProjectComment(Number(`${this.$route.params.project}`), this.comment);

        this.logs = [];

        this.handleLogsResponse(data, meta);
      } finally {
        this.is_loading = false;
      }

      this.comment = '';
    },

    handleScroll: function (event: Event) {
      const el = event.target;
      if (el.scrollHeight - (el.scrollTop + el.clientHeight) <= 800) {
        // User has scrolled to the bottom
        this.loadNextPage();
      }
    },

    loadNextPage: async function() {
      if (this.next_page > this.last_page || this.is_loading) {
        return;
      }

      this.is_loading = true;
      try {
        const {meta, data} = await getProjectLogs(Number(`${this.$route.params.project}`), this.next_page);

        this.handleLogsResponse(data, meta);
      } finally {
        this.is_loading = false;
      }
    },

    handleLogsResponse: function (data: IProjectLog[], meta: IResponseMeta) {
      data.forEach((item) => this.logs.push(item));

      this.next_page = meta.current_page + 1;
      this.last_page = meta.last_page;
    }
  },

  computed: {
    logsList: function () {
      return this.logs.map((log: IProjectLog) => {
        let action = ACTIONS.EDITED;
        let value_fields = [log.value_before, '=>', log.value_after];

        if (log.value_before === null) {
          action = ACTIONS.CREATED;
          value_fields = [log.value_after, '', ''];
        } else if (log.value_after === null) {
          action = ACTIONS.DELETED;
          value_fields = [log.value_before, '', ''];
        }

        return {
          user: log.user,
          field: log.field,
          action: action,
          value: value_fields[0],
          value_operation: value_fields[1],
          value_after: value_fields[2],
          date: log.created_at,
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.avatar_url {
  border-radius: 50%;
}

.input {
  display: inline-block;
}

.form-comment {
  .input-comment {
    height: 80px;
    width: 600px;
    padding: 3px 8px;
    border-radius: 2px;
    border: 1px solid #e2e5ea;
    resize: none;
    overflow: auto;
  }

  .input-comment:focus {
    outline: none;
  }

  .button-comment {
    background: $primary-text-default;
    border: none;
    padding: 4px 16px 4px 16px;
    border-radius: 3px;
    gap: 4px;
    color: $neutrals-text-invert;
    font-weight: 600;
    cursor: pointer;
  }

  .button-comment.disabled {
    background: $disabled-background;
    color: $neutrals-text-invert;
    cursor: not-allowed;
  }
}

</style>
