<template>
    <div id="clock">
        <div class="time">{{ time }}</div>
        <div class="date">{{ date }}</div>
    </div>
</template>

<script>
    export default {
        name: 'Clock',
        data() {
            return {
                time: this.$moment(Date.now()).format("LT"),
                date: this.$moment(Date.now()).format("LL")
            }
        },
        mounted: function() {
            setInterval(this.updateTime, 1000);
        },
        methods: {
            updateTime() {
                this.time = this.$moment(Date.now()).format("LT");
                this.date = this.$moment(Date.now()).format("LL");
            }
        }
    }
</script>

<style scoped>
    #clock {
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .time {
        font-size: 8em;
        font-weight: bold;
    }

    .date {
        font-size: 3em;
    }
</style>
