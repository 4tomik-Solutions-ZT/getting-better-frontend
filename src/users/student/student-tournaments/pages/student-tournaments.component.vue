<template>
  <nav-bar-student/>

  <div class="container">
    <br>
    <h1 style="text-align: center;color: white"> TOURNAMENTS </h1>
    <br>
    <pv-card v-for="tournament of tournaments" style="width: 395px">
      <template #header>
        <pv-image v-bind:src="tournament.cyber.cyberImage"
                  size= "xlarge"
                  alt="image tournaments"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  width="275"
                  height="200"
                  preview/>
      </template>
      <template #title>
        {{ tournament.title }}
      </template>
      <template #subtitle>
        {{  tournament.description }}
      </template>
      <template #content>
        <pv-tag v-bind:severity="tournament.isRegistered?'success':'danger'" 
        v-bind:icon="tournament.isRegistered?'pi pi-check':'pi pi-times'">
        {{tournament.isRegistered?'Registered':'Not Registered'}}</pv-tag>
        <h4>Date: {{tournament.date}}</h4>
        <h4>Address: {{tournament.addres}}</h4>
        <br>
        <br>
        <pv-button v-bind:class="tournament.isRegistered?'p-button-danger':'p-button-success'"
         @click="toggleRegisterButton(tournament.isRegistered, tournament.id)">
        {{tournament.isRegistered?'Cancel Register':'Register to Tournament'}}</pv-button>
      </template>
      
      <template #footer>
      </template>

    </pv-card>

    <pv-dialog
        v-model:visible="tournamentDialog"
        :style="{ width: '500px'}"
        header="Tournament Information"
        :modal="true"
        class="p-fluid"
    >
      <div class="field">
        <span class="p-float-label">
          <pv-input-text
              type="text"
              id="title"
              v-model.trim="tournament.title"
              required="true"
              autofocus
              :class="{'p-invalid':submitted && !tournament.title}"
          />
          <label for="tournamentTitle">Title</label>
          <small class="p-error" v-if="submitted && !tournament.title"
          >Title is required</small>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-input-text
              type="text"
              id="name"
              v-model.trim="tournament.name"
              required="true"
              autofocus
              :class="{'p-invalid':submitted && !tournament.name}"
          />
          <label for="tournamentTitle">Cyber's name</label>
          <small class="p-error" v-if="submitted && !tournament.name"
          >Cyber's name is required</small>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-textarea
              id="urlToImage"
              v-model="tournament.urlToImage"
              required="false"
              rows="2"
              cols="2"
          />
          <label for="tournamentUrlToImage">Url to Image</label>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-textarea
              id="schedule"
              v-model="tournament.schedule"
              required="false"
              rows="2"
              cols="2"
          />
          <label for="tournamentSchedule">Schedule</label>
        </span>
      </div>

      <div class="field">
        <span class="p-float-label">
          <pv-input-text
              id="multiple"
              v-model="tournament.location"
              selectionMode="multiple"
              required="true"
              :manualInput="false"
          />
          <label for="tournamentChanel">Location</label>
          <small class="p-error" v-if="submitted && !tournament.location"
          >Location is required</small>
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
            @click="saveTournament"
        />
      </template>

    </pv-dialog>

    <br><br>
  </div>
</template>

<script>
import TournamentsService from "../../../coach/coach-tournament/services/tournaments.service";
import TournamentStudentsService from "../services/tournament-students.service";
export default {
  name: "student-tournaments",
  data() {
    return  {
      tournaments: [],
      tournamentsSelected: [],
      tournament_students: [],
      id: 1,
      students:[],
      tournament: {},
      coachTournaments:[],
      coachId:1,
      tournamentTitle:'',
      tournamentDate:'',
      tournamentAttacches:'',
      tournamentNew:{},


      coachDialog: false,
      submitted:false,
      tournamentService:null,
      tournamentId:1,
      tournamentDialog:false,
    };
  },
  mounted(){
    this.id=localStorage.getItem("id");
    this.retrieveTournaments();
  },
  methods:{
    retrieveTournaments(){
      this.tournamentsSelected = [];

      /*TournamentsService.getAll().then((response)=>{
        this.tournaments=response.data;
      })*/

      TournamentStudentsService.getAll().then((response)=>{
        this.tournament_students = response.data.filter(x=>x.student.id==this.id);
        TournamentsService.getAll().then((response2)=>{
          this.tournaments = response2.data;
          console.log(this.tournaments);
          for(let tournament of this.tournaments){
            tournament.isRegistered=false;
          }
          for(let tournament_student of this.tournament_students){
            this.tournaments.find(x=>(x.id==tournament_student.tournament.id)).isRegistered=true;
          }
        })
      });
    },
    getStorableAdvisory(tournament){
      return {
        id: tournament.id,
        name: tournament.name,
        title: tournament.title,
        schedule:tournament.schedule,
        location: tournament.location,
        urlToImage: tournament.urlToImage
      };
    },
    openNew() {
      this.tournament = {};
      this.submitted = false;
      this.tournamentDialog = true;
    },
    hideDialog() {
      this.tournamentDialog = false;
      this.submitted = false;
    },
    saveTournament(){
      this.tournament.id=0;
      TournamentsService.create(this.tournament).then((response)=>{
        this.retrieveTournaments();
        this.hideDialog();
      })
    },
    toggleRegisterButton(isRegistered, id){
      if(isRegistered){
        TournamentStudentsService.getAll().then((response)=>{
          let tournament_student = response.data.filter(x=>x.tournament.id==id&&x.student.id==this.id);
          console.log(tournament_student);
          TournamentStudentsService.delete(tournament_student[0].id).then(()=>{
            this.retrieveTournaments();
          })
        })
        return;
      }
      if(!isRegistered){
        let tournamentStudentsModel={};
        tournamentStudentsModel.id=0;
        tournamentStudentsModel.tournamentId=id;
        tournamentStudentsModel.studentId=this.id;
        TournamentStudentsService.create(tournamentStudentsModel).then(()=>{
          this.retrieveTournaments();
        })
      }
    },
    cancelTournament(id){
      console.log(id);
      TournamentStudentsService.getByTournamentIdAndStudentId(id,this.id).then((response)=>{
        let tournament_student = response.data;
        TournamentStudentsService.delete(tournament_student[0].id).then(()=>{
          this.retrieveTournaments();
        })
      })
    }

  }
};
</script>

<style scoped>

</style>