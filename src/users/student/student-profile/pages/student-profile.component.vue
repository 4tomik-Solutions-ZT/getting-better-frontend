<template>
  <div>
    <nav-bar-student/>

    <div class ="container">
      <br>
      <h1 style="text-align: center;color: white"> PROFILE </h1>
      <br>
      <pv-card class="p-card" style="text-align: center">
        <template #header>
          <pv-image
              class="pv-image-holder"
              imageClass="pv-image-circle"
              v-bind:src="student.userImage"
              alt="Image Coach"
              width="275"
              height="275"
              preview
          />
        </template>

        <template #content>
          <i class="pi pi-user"></i>
          <p class="pv-p">Nickname:</p>
          <pv-input-text  v-model="student.nickName"/>
          <pv-divider></pv-divider>

          <i class="pi pi-user"></i>
          <p class="pv-p">First Name:</p>
          <pv-input-text   v-model="student.firstName"/>
          <pv-divider></pv-divider>

          <i class="pi pi-user"></i>
          <p class="pv-p">Last Name:</p>
          <pv-input-text  v-model="student.lastName"/>
          <pv-divider></pv-divider>

          <i class="pi pi-user"></i>
          <p class="pv-p">User Image:</p>
          <pv-input-text  v-model="student.userImage"/>
          <pv-divider></pv-divider>


          <pv-button label="Update Profile" @click="update"/>
        </template>

      </pv-card>
    </div>
  </div>
</template>

<script>
import StudentsService from '../../../coach/coach-student/services/students.service'

export default {
  name: "student-profile",
  data() {
    return {
      profiles: [],
      studentDialog: false,
      submitted: false,
      coachService: null,
      students: [],
      student:{},
      coachId: 1,
    };
  },

  mounted() {
    this.coachId=localStorage.getItem("id");
    StudentsService.getAll().then((response)=>{
      this.students=response.data;
      this.student=this.students.find(x=>(x.id==this.coachId));
      console.log(this.student);
    });
    /*
    this.coachService = new coachProfileService();
    this.coachService.getAll().then((response) => {
      this.profiles = response.data;
      this.coach = response.data;

      console.log(this.profiles);
    });*/

  },
  methods: {
    update(){
      StudentsService.update(this.coachId,this.student).then((response)=>{
        
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
    findIndexById(id) {
      return this.profiles.findIndex((coach) => coach.id === id);
    },
    editCoachProfile(coach) {
      this.student = { ...coach };
      this.studentDialog = true;
    },
    saveCoachProfile() {
      this.submitted = true;
      this.student = this.getStorableCoach(this.student);
      this.coachService.update(this.student.id, this.student).then((response) => {
        this.profiles[this.findIndexById(response.data.id)] =
            this.response.data;
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Coach Profile Updated",
          life: 3000,
        });
        console.log(response);
      });
      this.studentDialog = false;
      this.student = {};
    },
  },
};
</script>

<style>

.pv-image-circle{
  border-radius: 30%;
  margin-left: auto;

}

.pv-p{
  font-family: Roboto;
  font-size: x-large;
  size: 100px;
  font-weight: bold;
}
.p-card{
  box-shadow: 0 4px 20px 20px rgba(0,0,0,0.2);
  transition: 0.3s;
  border-radius: 5px; /* 5px rounded corners */
  width: 70%;
  padding-left: 20px;
  padding-top: 20px;
  margin:auto;
  margin-top:20px;
}
.container{
  background-color: #2455A5;
  margin-left: 100px;
  margin-right: 100px;
}


</style>