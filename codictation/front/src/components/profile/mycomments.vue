<template>
<q-page class="q-pa-md">
    <h3 class="q-my-md">Comments</h3>
    <q-separator insert style="width: 55%" />
    <div v-if="commentList.length > 0" class="q-pa-md" style="max-width: 85%">
        <q-list v-for="(item, index) in commentList" :key="index" v-model="commentList">
            <q-expansion-item popup default-opened :caption="item.taskPublisher" :content-inset-level="0.5">
                <template v-slot:header>
                    <q-item-section avatar>
                        <q-avatar icon="assignment" color="primary" text-color="white" />
                    </q-item-section>

                    <q-item-section>
                        {{ item.taskTitle }}
                        <span class="text-grey text-caption">By {{ item.taskPublisher }}</span>
                    </q-item-section>

                    <q-item-section side>
                        <div class="row items-center">
                            <q-btn flat color="pink-4" label="View Details" @click="intoTask(index)"/>
                        </div>
                    </q-item-section>
                </template>
                <q-separator />
                <q-card v-for="(subItem, i) in item.child" :key="i">
                    <q-card-section class="row">
                        <q-item-section side>
                            <q-icon name="comment" class="text-purple" style="font-size: 1.35em" />
                        </q-item-section>
                        <q-item-section class="comment-box">
                            {{ subItem.comment }}
                        </q-item-section>
                        <q-item-section side>
                            {{ subItem.time }}
                        </q-item-section>
                    </q-card-section>
                    <div v-if="subItem.replies.length > 0">
                        <q-expansion-item expand-separator icon="reply_all" :content-inset-level="0.5" label="View All Replies" header-class="text-grey-6">
                            <q-separator />
                            <q-card  v-for="(repItem, key) in subItem.replies" :key="key">
                                <q-card-section class="row">
                                    <q-item-section side>
                                        <q-icon name="question_answer" class="text-purple" style="font-size: 1.35em" />
                                    </q-item-section>
                                    <q-item-section class="comment-box">
                                        <span><em class="text-bold">{{ repItem.responder }}</em> --- {{ repItem.comment }}</span>
                                    </q-item-section>
                                    <q-item-section side>
                                        {{ repItem.time }}
                                    </q-item-section>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                    </div>
                    <q-separator />
                </q-card>
            </q-expansion-item>
        </q-list>
    </div>
    <div v-else>No comment yet...</div>
</q-page>
</template>

<script>

export default {
    data() {
        return {
            name: "", //当前用户的用户名
            userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
            api: "/api",
            commentList: [],
        }
    },
    methods: {
        // 进入到任务详情页面
        intoTask(index) {
            var diffId = this.commentList[index].taskId; //任务_id
            var path = "/diff/" + diffId;
            this.$axios.get(this.api + "/currentTask?_id=" + diffId).then((res) => {
                if (res.data.length == 0) {
                this.$notify({
                    type: "warning",
                    message: "The task has been deleted.",
                    position: "top-right",
                    offset: 100,
                });
                } else {
                this.$router.push(path);
                }
            });
        },
    },
    created() {
        this.name = sessionStorage.getItem("userName");
        console.log(this.name);
        this.$axios.get(this.api + "/profile?name=" + this.name).then((res) => {
            this.userId = res.data[0]._id; //找地方保存
            var myComments = res.data[0].myComments // 从数据库中获取“myComments”对象数组
            console.log("myComments", myComments);

            // 根据相同的taskTitle，合并“myComments”数组，形成新数组“commentList”
            var commentsInfo = {};
            myComments.forEach((item) => {
                var { taskTitle } = item;
                if (!commentsInfo[taskTitle]) {
                    commentsInfo[taskTitle] = {
                        taskTitle,
                        taskPublisher: item.taskPublisher,
                        taskId: item.taskId,
                        child: []
                    }
                }
                commentsInfo[taskTitle].child.push({
                    comment: item.comment,
                    time: item.time,
                    replies: item.reply,
                });
            });
            this.commentList = Object.values(commentsInfo);
        });
    },
}
</script>

<style>
.comment-box {
    justify-content: flex-start;
}
.q-item__section.column.q-item__section--main.justify-center {
    flex-direction: column;
}
</style>
