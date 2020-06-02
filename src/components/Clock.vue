<template>
    <div class="gridview-component clock">
        <div v-if="showTime" class="time">{{ time }}</div>
        <div v-if="showDate" class="date">{{ date }}</div>
    </div>
</template>

<script>
    export default {
        name: 'Clock',
        computed: {
            dateFormat: function () {
                return Object.prototype.hasOwnProperty.call(this.options, 'dateFormat') ? this.options.dateFormat : 'LL'
            },
            showDate: function () {
                return Object.prototype.hasOwnProperty.call(this.options, 'showDate') ? this.options.showDate : true
            },
            showTime: function () {
                return Object.prototype.hasOwnProperty.call(this.options, 'showTime') ? this.options.showTime : true
            },
            timeFormat: function () {
                return Object.prototype.hasOwnProperty.call(this.options, 'timeFormat') ? this.options.timeFormat : 'LT'
            }
        },
        data() {
            return {
                time: '',
                date: ''
            }
        },
        mounted: function() {
            setInterval(this.updateTime, 1000);
        },
        methods: {
            updateTime() {
                this.time = this.$moment(Date.now()).format(this.timeFormat);
                this.date = this.$moment(Date.now()).format(this.dateFormat);
            }
        },
        props: {
            instanceId: Number,
            options: Object
        }
    }
</script>

<style scoped>
    .clock {
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .time {
        font-size: 8em;
        font-weight: bold;
    }

    .date {
        font-size: 3em;
    }
</style>
