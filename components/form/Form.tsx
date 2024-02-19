"use client";

import { Formik, Form, ErrorMessage } from "formik";

import "./styles.css";
import ActionLink, { Actions } from "./ActionLink";
import React, { useEffect } from "react";
import Input, { InputProps } from "./Input";
import Submit from "./Submit";
import { redirect, useRouter } from "next/navigation";
import { Values, validate } from "./functions/validate";
import { ValidationTypes, validation } from "@/utils/consts";
import { generateInitialValue } from "./functions/generateInitialValue";

type Props = {
  title: string;
  actions: Actions[];
  onSubmit: (values: Values) => void;
  google?: boolean;
  inputs: InputProps[];
  submitTitle: string;
};

export default function FormComponent({
  title,
  actions,
  onSubmit,
  google,
  inputs,
  submitTitle,
}: Props) {
  const initialValues = inputs.reduce((prev, curr) => {
    return { ...prev, [curr.id]: generateInitialValue(curr.type) };
  }, {});

  const router = useRouter();

  useEffect(() => {
    localStorage.getItem(`token`) && redirect("/dashboard");
  }, []);

  const handleSubmit = (values: Values) => {
    onSubmit(values);
    localStorage.setItem(`token`, `test`);
    router.push("/dashboard");
  };

  return (
    <section className="form mx-auto bg-white">
      <h2 className="text-center fs-5 fw-semibold pb-4">{title}</h2>

      {google && (
        <button className="mt-2 bg-gray w-100 py-2 fw-semibold">
          Continue with Google
        </button>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={(values) => validate(values, inputs)}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            {inputs.map((el) => (
              <div key={el.id} className="field">
                <Input
                  id={el.id}
                  type={el.type}
                  title={el.title}
                  placeholder={el.placeholder}
                  required={el.required}
                />
                <ErrorMessage name={el.id}>
                  {(msg) => (
                    <span className="text-danger py-1">
                      {msg}{" "}
                      {validation[el.type as keyof ValidationTypes] && (
                        <div key={el.id} className="validation-msg-btn">
                          <span>?</span>
                          <span className="validation-msg">
                            {validation[el.type as keyof ValidationTypes].msg}
                          </span>
                        </div>
                      )}
                    </span>
                  )}
                </ErrorMessage>
              </div>
            ))}
            <Submit title={submitTitle} />
          </Form>
        )}
      </Formik>

      <div className="d-flex justify-content-between pt-5">
        {actions.map((key) => (
          <ActionLink key={key.title} link={key.link} title={key.title} />
        ))}
      </div>
    </section>
  );
}
