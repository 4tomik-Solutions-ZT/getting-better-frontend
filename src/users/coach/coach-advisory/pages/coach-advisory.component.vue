<template>
  <nav-bar-coach/>
  <div class="container">
    <br>
    <h1 style="text-align: center;color: white"> ADVISORIES</h1>
    <br>
    <pv-button
        class="p-button-lg"
        label="New Advisory"
        icon="pi pi-plus"
        align="Center"
        @click="openNew"
    />

    <br>

    <div class="container-2">
      <pv-card style="width: 24.8rem; margin-bottom: 2em" v-for="advisory of advisories">

        <template #header v-if="advisory">
          <pv-image v-bind:src="advisory.advisoryImage"
                    size= "large"
                    alt="image advisory"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    width="250"
                    height="200"
                    preview/>
        </template>

        <template #title v-if="advisory">
          {{advisory.title}}
        </template>

        <template #subtitle v-if="advisory">
          {{advisory.description}}
        </template>

        <template #content v-if="advisory">
          Date: {{advisory.date}}
          <br>
          Hour: {{advisory.hour}}
          <br>
          <h4>Student Name: {{advisory.student.nickName}}</h4>
          <h4>Discord Server: {{advisory.discorServer}} </h4>
        </template>

        <template #footer v-if="advisory">
          <pv-button label="Delete Advisory" @click="deleteAdvisory(advisory.id)"/>
        </template>
      </pv-card>
    </div>
      <br><br>

    <pv-dialog
        v-model:visible="advisoryDialog"
        :style="{ width: '500px'}"
        header="Advisory Information"
        :modal="true"
        class="p-fluid"
    >
      <div class="field">
        <span class="p-float-label">
          <pv-input-text
              type="text"
              id="title"
              v-model.trim="advisory.title"
              required="true"
              autofocus
              :class="{'p-invalid':submitted && !advisory.title}"
          />
          <label for="advisoryTitle">Title</label>
          <small class="p-error" v-if="submitted && !advisory.title"
          >Title is required</small>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-textarea
              id="description"
              v-model="advisory.description"
              required="false"
              rows="2"
              cols="2"
          />
          <label for="advisoryAttaches">Description</label>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-input-text
              id="multiple"
              v-model="advisory.date"
              selectionMode="multiple"
              required="true"
              :manualInput="false"
          />
          <label for="advisoryDate">Date</label>
          <small class="p-error" v-if="submitted && !advisory.date"
          >Date is required</small>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-input-text
              id="multiple"
              v-model="advisory.hour"
              selectionMode="multiple"
              required="true"
              :manualInput="false"
          />
          <label for="advisoryDate">Hour</label>
          <small class="p-error" v-if="submitted && !advisory.hour"
          >Hour is required</small>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-input-text
              id="multiple"
              v-model="advisory.advisoryImage"
              selectionMode="multiple"
              required="true"
              :manualInput="false"
          />
          <label for="advisoryUrlToImage">Advisory to Image</label>
          <small class="p-error" v-if="submitted && !advisory.advisoryImage"
          >Url is required</small>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-dropdown v-model="advisory.studentSelected" :options="studentsCoach" optionLabel="nickName" placeholder="Select a Student" />
          <small class="p-error" v-if="submitted && !advisory.studentName"
          >DiscordServer is required</small>
        </span>
      </div>
      <div class="field">
        <span class="p-float-label">
          <pv-input-text
              type="text"
              id="title"
              v-model.trim="advisory.discorServer"
              required="true"
              autofocus
              :class="{'p-invalid':submitted && !advisory.discorServer}"
          />
          <label for="advisoryDiscordServer">Discord Server</label>
          <small class="p-error" v-if="submitted && !advisory.discorServer"
          >DiscordServer is required</small>
        </span>
      </div>


      <template #footer>
        <pv-button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
        />
        <pv-button
            label="Save"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveCoachAdvisory"
        />
      </template>

    </pv-dialog>


  </div>

</template>

<script>
import CoachesService from '../../services/coaches.service.js';
import AdvisoriesService from '../services/advisories.service.js';
import StudentsService from '../../coach-student/services/students.service.js';
import CoachStudentsService from '../../../student/student-selected-coaches/services/coach-students.service.js';
export default {
  name: "coach-advisory",
  data() {
    return {
      advisories: [],
      id: 1,
      coachAdvisories: [],
      coachId:1,
      advisoryTitle: '',
      advisoryDescription: '',
      advisoryDate: '',
      advisoryHour:'',
      advisoryDiscordServer: '',
      advisoryNew: {},
      advisory: {},
      coach: {},
      coaches:[],
      coachName: '',
      studentsCoach: [],
      coach_students: [],

      coachDialog: false,
      submitted: false,
      advisoryService: null,
      advisoryId: 1,
      advisoryDialog: false,

      selectedCity: null,
      students_: [
        {name: '', code: 'NY'},
        {name: 'Carlos', code: 'RM'},
        {name: 'Pepe', code: 'LDN'},
        {name: 'Oscar', code: 'IST'},
        {name: 'Omar', code: 'PRS'}
      ]


    };
  },
  mounted() {
    this.id = localStorage.getItem("id");
    this.retrieveAdvisories();

  },
  methods: {
    retrieveAdvisories(){
      this.studentsCoach = [];
      AdvisoriesService.getAll().then((response)=>{
        this.advisories=response.data.filter(x=>(x.coach.id==this.id));
        for(let advisory of this.advisories){
          StudentsService.getAll().then((response2)=>{
            advisory.studentNickname = response2.data.find(x=>x.id==advisory.student.id).nickname;
          })
        }
      })
      CoachStudentsService.getAll().then((response)=>{
        this.coach_students=response.data.filter(x=>(x.coach.id==this.id));
        for(let coach_student of this.coach_students){
          StudentsService.getAll().then((response2)=>{
            this.studentsCoach.push(response2.data.find(x=>x.id==coach_student.student.id));
          })
        }
      })

    },
    deleteAdvisory(advisoryId){
      AdvisoriesService.delete((advisoryId)).then(()=>{
        this.retrieveAdvisories();
      })
    },
    getStorableCoach(coach) {
      return {
        id: coach.id,
        nickname: coach.nickname,
        name: coach.name,
        lastname: coach.lastname,
        role: coach.role,
        heroes: coach.heroes,
        tournaments: coach.tournaments,
        bibliography: coach.bibliography,
      };
    },
    getStorableAdvisory(advisory) {
      return {
        id: advisory.id,
        title: advisory.title,
        description: advisory.description,
        date: advisory.date,
        hour: advisory.hour,
        studentName: advisory.studentName,
        discordServer: advisory.discordServer,
        cyberImage: advisory.cyberImage,
        coachId: advisory.coachId,
      };
    },

    findIndexById(id) {
      return this.advisories.findIndex((advisory) => advisory.id === id);
    },

    editCoachAdvisory(advisory) {
      this.advisory = { ...advisory };
      this.advisoryDialog = true;
    },
    openNew() {
      this.advisory = {};
      this.submitted = false;
      this.advisoryDialog = true;
    },
    hideDialog() {
      this.advisoryDialog = false;
      this.submitted = false;
    },
    saveCoachAdvisory() {
      if(!this.advisory.studentSelected||!this.advisory.title||!this.advisory.description||
          !this.advisory.date|| !this.advisory.hour||!this.advisory.advisoryImage||!this.advisory.discorServer) return;
      this.advisory.id=0;
      this.advisory.coachId=this.id;
      this.advisory.studentId=this.advisory.studentSelected.id;
      delete this.advisory.studentSelected;

      AdvisoriesService.create(this.advisory).then((response)=>{
        this.hideDialog();
        this.retrieveAdvisories();
      })
    },
  },
};

</script>
<style>
.container{
  background-color: #2455A5;
  margin-left: 100px;
  margin-right: 100px;
}
.spacer{
  flex: 1 1 auto;
}
.container-2{

}


</style>