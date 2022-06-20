import http from "../../../../core/services/http-common.js"
export class CoachStudentsService {
    endPoint='/tournament-students';

    getAll() {
        return http.get(`${this.endPoint}`);

    }
     getById(id){
        return http.get(`${this.endPoint}/?id=${id}`);
    }
    getByStudentId(id){
        return http.get(`${this.endPoint}/?studentId=${id}`);
    } 
    getByTournamentId(id){
        return http.get(`${this.endPoint}/?tournamentId=${id}`);
    } 
    create(CreateTutorialDto) {
        return http.post(this.endPoint,CreateTutorialDto)
    }

    delete(id) {
        return http.delete(`${this.endPoint}/${id}`);
    }

    update(id,updateTutorialDto) {
        return http.put(`${this.endPoint }/${id}`,updateTutorialDto);
    
    }
}

export default new CoachStudentsService();