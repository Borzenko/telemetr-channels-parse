<template>
  <div id="app">
    <b-container fluid>
      <div>
        <b-table striped hover :fields="fields" :items="items">
          <template v-slot:cell(last_invite_link)="data">
            <a :href="data.item.last_invite_link" target="_blank">link</a>
          </template>
          <template v-slot:cell(avatar_link)="data">
            <b-img style="width: 40px" :src="data.item.avatar_link"></b-img>
          </template>
          <template v-slot:cell(created_at)="data">
            {{ parseDate(data.item.created_at )}}
          </template>
          <template v-slot:cell(name)="{ item }">
            <p style="text-decoration: line-through;" v-if="item.prev"> {{ item.prev.name }}</p>
            {{ item.name }}
          </template>
          <template v-slot:cell(type)="{ item }">
            <span v-if="item.prev">Измененный</span>
            <span v-else>Новый</span>
          </template>
        </b-table>
        <b-pagination
          class="mt-3"
          v-model="page"
          :total-rows="total"
          :per-page="50"
          @change="handlePaginationUpdate"
          aria-controls="my-table"
        ></b-pagination>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

const baseUrl = process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000'

export default {
  name: 'App',
  data() {
    return {
      fields: [{
        label: 'Ссылка',
        key: 'last_invite_link'
      }, {
        label: 'Аватар',
        key: 'avatar_link'
      }, {
        label: 'Название канала',
        key: 'name'
      }, {
        label: 'Описание',
        key: 'description'
      }, {
        label: 'Время создания',
        key: 'created_at'
      }, {
        label: 'Тип',
        key: 'type'
      },  {
        label: 'Кол-о подписчиков',
        key: 'subscribers'
      }],
      page: 1,
      items: [],
      total: 0,
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      axios.get(`${baseUrl}/api/channels`, {
        params: {
          page: this.page
        } 
      }).then(res => {
        this.items = res.data.results
        this.total = res.data.total 
        console.log(this.items.filter(item => !!item.prev))
      })
    },
    parseDate(date) {
      return moment(date).lang('ru').fromNow()
    },
    handlePaginationUpdate(query) {
      this.page = query;
      this.fetch()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
