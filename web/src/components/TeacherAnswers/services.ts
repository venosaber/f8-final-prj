import type {ExamFormData} from "./types.ts";
import {getValidAccessToken} from "../../router/auth.ts";
import {postMethod, putMethod} from "../../utils/api.ts";

export const submitExam = async (data: ExamFormData) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('code', data.code);
    formData.append('exam_group_id', data.examGroupIdNum.toString());
    formData.append('number_of_question', data.number_of_question.toString());
    formData.append('total_time', (data.total_time * 60).toString());
    formData.append('questions', JSON.stringify(data.questions));
    formData.append('description', data.description);

    if(data.selectedFile) {
        formData.append('examFile', data.selectedFile);
    }

    const accessToken: string | null = await getValidAccessToken();
    if (!accessToken) {
        throw new Error("No valid access token found.");
    }

    const headers = {Authorization: `Bearer ${accessToken}`};

    if (data.examIdNum === 0) { // Create mode
        return await postMethod('/exams', formData, { headers });
    } else { // Update mode
        return await putMethod(`/exams/${data.examIdNum}`, formData, { headers });
    }
}