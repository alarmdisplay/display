<template>
    <div v-bind:id="elementId" class="gridview-component">
        <div class="announcement-list">
            <p class="header">{{ this.options.title || 'Ankündigungen' }}</p>
            <ul v-if="announcements.length > 0">
                <Item v-for="announcement in announcements" v-bind:key="announcement.id"
                      v-bind:announcement="announcement"/>
            </ul>
            <div v-else class="no-announcements">
                <div class="icon-and-text">
                    <font-awesome-icon icon="bullhorn" size="2x"/>
                    <p>Keine Ankündigungen</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Item from "@/components/announcements/Item";
    export default {
        name: "AnnouncementList",
        components: {
            Item
        },
        computed: {
            announcements: function () {
                let content = this.$root.$data.content[this.instanceId];
                if (!Array.isArray(content)) {
                    return []
                }

                // Return all announcements that are currently valid or do not have validity information
                return content.filter(announcement => {
                    return (!announcement.validFrom || announcement.validFrom <= this.$root.$data.seconds) &&
                        (!announcement.validTo || announcement.validTo >= this.$root.$data.seconds)
                })
            }
        },
        data() {
            return {
                elementId: `announcement-list-${this.instanceId}`,
            }
        },
        props: {
            instanceId: Number,
            options: Object
        }
    }
</script>

<style scoped>
    .announcement-list {
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
        background-color: #cccccc;
        text-align: start;
    }

    .header {
        background-color: #393939;
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
        color: #ddd;
        font-weight: bolder;
        margin: 0;
        padding: 1em;
        text-align: center;
    }

    ul {
        margin-top: 0;
        padding: 0;
    }

    .no-announcements {
        color: #393939;
        height: 100%;
        font-size: 2vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .no-announcements .icon-and-text {
        text-align: center;
    }
</style>
