<template>
    <li>
        <span class="title">{{ announcement.title }}</span><br>
        <span class="text">{{ announcement.text }}</span>
        <div class="date">{{ issueDate }}</div>
    </li>
</template>

<script>
    export default {
        name: "Item",
        computed: {
            issueDate: function () {
                let date = new Date(this.announcement.issued);
                if (isNaN(date.valueOf())) {
                    return ''
                }
                return this.$moment(date).format("LL")
            }
        },
        props: {
            announcement: Object
        }
    }
</script>

<style scoped>
    li {
        background-color: #ddd;
        border-bottom: 1px solid #999;
        list-style: none;
        padding: 1em;
    }

    .date {
        text-align: right;
    }

    .title {
        font-size: large;
        font-weight: bold;
    }
</style>
