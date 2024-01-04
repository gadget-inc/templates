import { useActionForm, useFieldArray } from "@gadgetinc/react";
import React from "react";
import {api} from "../api";

export const CreateQuizPageAlt = () => {
    const {control, register, formState: { isDirty, isLoading }} = useActionForm(api.quiz.create);

    return (<div> 
        <input {...register("quiz.title")} />
    </div>)
}