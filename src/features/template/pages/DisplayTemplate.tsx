import { useAppDispatch } from 'app/hooks';
import * as React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Template1 from '../components/Template1';
import Template2 from '../components/Template2';
import Template3 from '../components/Template3';
import { FetchAttrs, templateActions } from '../templateSlice';

export default function DisplayTemplate() {
  const { storeId, templateId } = useParams();
  const dispatch = useAppDispatch();
  const params: FetchAttrs = {
    storeId: Number(storeId),
    typeId: 4
  };
  useEffect(() => {
    dispatch(templateActions.fetchAttrs(params));
  });
  let template;
  if (Number(templateId) === 1) {
    template = <Template1 />;
  } else if (Number(templateId) === 2) {
    template = <Template2 index={1} />;
  } else if (Number(templateId) === 3) {
    template = <Template3 />;
  }

  return <div>{template}</div>;
}
