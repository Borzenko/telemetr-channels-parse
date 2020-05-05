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
                <template v-slot:cell(categories)="{ item }">
                    <div v-for="(category, indx) in item.categories" v-bind:key="indx">
                        <p class='category'>{{category}}
                            <b-button pill size="sm" class="remove-btn" variant="secondary" @click="$bvToast.show(`${item.name}${indx}`)">
                                &#10006;
                            </b-button>
                            <b-toast v-bind:id="`${item.name}${indx}`" title="Удалить?" static no-auto-hide no-close-button>
                                <div class="toast-body-flex">
                                    <b-button size="sm" variant="outline-success" @click="">&#10004;</b-button>
                                    <b-button size="sm" variant="outline-dark" @click="$bvToast.hide(`${item.name}${indx}`)">&#10008;</b-button>
                                </div>
                            </b-toast>
                        </p>
                    </div>
                    <b-button size="sm" class="w-100" variant="secondary" @click="$bvToast.show(`addCategoryFor${item.name}`)">
                        Добавить
                    </b-button>
                    <b-toast v-bind:id="`addCategoryFor${item.name}`" title="Выберите категорию" static no-auto-hide>
                        <div class="toast-body-column">
                            <b-form-select v-model="selected" :options="options" size="sm"></b-form-select>
                            <b-button size="sm" variant="outline-success" class="mt-2" @click="">Сохранить</b-button>
                        </div>
                    </b-toast>
                </template>
                <template v-slot:cell(type)="{ item }">
                    <span v-if="item.prev">Измененный</span>
                    <span v-else>Новый</span>
                </template>
            </b-table>
            <b-pagination class="mt-3" v-model="page" :total-rows="total" :per-page="50" @change="handlePaginationUpdate" aria-controls="my-table"></b-pagination>
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
            fields: [
                'index',
                {
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
                    label: 'Категории',
                    key: 'categories'
                }, {
                    label: 'Время создания',
                    key: 'created_at'
                }, {
                    label: 'Тип',
                    key: 'type'
                }, {
                    label: 'Кол-о подписчиков',
                    key: 'subscribers'
                }
            ],
            page: 1,
            items: [],
            total: 0,
            options: [],
            selected: null,
        }
    },
    mounted() {
        this.fetch(),
            this.fetchCategories()
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
        },
        fetchCategories() {
            axios.get(`${baseUrl}/api/categories`).then(res => {
                this.options = res.data.map(item => {
                    return {
                        value: item,
                        text: item
                    }
                })
            })
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

.category {
    border: 1px solid #ffb822;
    padding: 2px 25px;
    border-radius: 5px;
    position: relative;
}

.category span {}

.remove-btn {
    position: absolute;
    top: -10px;
    right: -12px;
    cursor: pointer;
}

.b-toast .toast {
    margin: 5px 0;
}

.toast-body-flex {
    display: flex;
    justify-content: space-around;
}

.toast-body-column {
    display: flex;
    flex-direction: column;
}

.toast-body {
    padding: 0.45rem !important;
}
</style>
