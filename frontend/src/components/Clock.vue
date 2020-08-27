<template>
    <div class="gridview-component clock">
        <div v-if="showTime" class="time">{{ time }}</div>
        <div v-if="showDate" class="date">{{ date }}</div>
    </div>
</template>

<script>
    export default {
        name: 'Clock',
        data() {
            return {
                dateFormat: 'll',
                timeFormat: 'LT',
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
            showDate: {
              type: Boolean,
              default: true
            },
            showTime: {
              type: Boolean,
              default: true
            }
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
        font-size: 6em;
        font-weight: bold;
    }

    .date {
        font-size: 2.5em;
        margin-top: -0.1em;
    }
</style>
