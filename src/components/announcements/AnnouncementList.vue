<template>
    <div v-bind:id="elementId" class="announcement-list">
        <p class="header">Announcements</p>
        <ul>
            <li v-if="announcements.length === 0" class="no-announcements">Keine Ankündigungen</li>
            <Item v-for="announcement in announcements" v-bind:key="announcement.id" v-bind:announcement="announcement" />
        </ul>
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

                return content
            }
        },
        data() {
            return {
                elementId: `announcement-list-${this.instanceId}`,
            }
        },
        props: {
            instanceId: Number
        }
    }
</script>

<style scoped>
    .announcement-list {
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19);
    }

    .header {
        background-color: #222;
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

    li.no-announcements {
        background-color: #ddd;
        border-bottom: 1px solid #999;
        list-style: none;
        padding: 2em;
        text-align: center;
    }
</style>
