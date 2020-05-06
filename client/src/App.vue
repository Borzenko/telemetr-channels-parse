<template>
<div id="app">
    <!-- <MultiFilter :options="options" :filterChannels="filterChannels"></MultiFilter>
    <p>{{filterItems}}</p> -->
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
                    <div style="max-width: 300px; margin: 0 auto; overflow: scroll">
                        <p style="text-decoration: line-through;" v-if="item.prev"> {{ item.prev.name }}</p>
                        {{ item.name }}
                    </div>
                </template>
                <template v-slot:cell(categories)="{ item }">
                    <template v-for="(category, indx) in item.categories">
                        <span class="category" v-bind:key="indx">{{ category }}
                            <b-icon-trash class="remove-category" @click="deleteCategory(item._id,category)"></b-icon-trash>
                            <template v-if="indx < item.categories.length - 1">, </template>
                        </span>
                        <!-- <p class='category'>{{category}}
                            <b-button pill size="sm" class="remove-btn" variant="secondary" @click="$bvToast.show(`${item._id}${indx}`)">
                                &#10006;
                            </b-button>
                            <b-toast v-bind:id="`${item._id}${indx}`" title="Удалить?" static no-auto-hide no-close-button>
                                <div class="toast-body-flex">
                                    <b-button size="sm" variant="outline-success" @click="deleteCategory(item._id,category);$bvToast.hide(`${item._id}${indx}`)">&#10004;</b-button>
                                    <b-button size="sm" variant="outline-dark" @click="$bvToast.hide(`${item._id}${indx}`)">&#10008;</b-button>
                                </div>
                            </b-toast>
                        </p> -->
                    </template>
                    <b-icon-plus @click="$bvToast.show(`addCategoryFor${item._id}`)"></b-icon-plus>
                    <b-toast v-bind:id="`addCategoryFor${item._id}`" title="Выберите категорию" static no-auto-hide>
                        <div class="toast-body-column">
                            <b-form-select v-model="selected" :options="options" size="sm"></b-form-select>
                            <b-button size="sm" variant="outline-success" class="mt-2" @click="addCategory(item._id);$bvToast.hide(`addCategoryFor${item._id}`)">Сохранить</b-button>
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
    components: {
    },
    data() {
        return {
            fields: [
                {
                    label: 'Ссылка',
                    key: 'last_invite_link'
                }, {
                    label: 'Аватар',
                    key: 'avatar_link'
                }, {
                    label: 'Название канала',
                    key: 'name',
                    thStyle: { maxWidth: '300px'}
                }, {
                    label: 'Описание',
                    key: 'description'
                }, {
                    label: 'Категории',
                    key: 'categories',
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
            filterItems: [],
            total: 0,
            options: [],
            selected: null
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
        },
        async addCategory(id) {
            await axios.put(`${baseUrl}/api/channels`, {
                id,
                category: this.selected,
                type: 'add'
            })
            this.selected = null
            this.fetch()
        },
        async deleteCategory(id, category) {
            await axios.put(`${baseUrl}/api/channels`, {
                id,
                category,
                type: 'delete'
            })
            this.fetch()

        },
        filterChannels(arr) {
            this.filterItems = this.items.filter(item => {
                if (item.categories) {
                    const test = item.categories.map(cat => {
                        const indx = arr.find(elem=>elem===cat)
                        if (indx.length>0) {
                            return indx
                        }
                    })
                    console.log(test)
                }
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
    position: relative;
}

.remove-category {
    display: none !important;
    position: absolute;
    top: -1px;
    right: 1px;
    font-size: 22px;
    cursor: pointer;
    background: white;
    border: 1px solid;
    border-radius: 50%;
    padding: 3px 3px;
}

.category:hover .remove-category {
    display: inline-block !important;
}

.category span {
}
/* 
.remove-btn {
    
} */

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
