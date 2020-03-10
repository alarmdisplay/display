<template>
    <div id="clock">
        <p class="time">{{ time }}</p>
        <p class="date">{{ date }}</p>
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
        text-align: center;
        color: white;
    }

    .time {
        font-size: 6em;
        font-weight: bold;
        margin-bottom: -10px;
    }

    .date {
        font-size: 2em;
    }
</style>
