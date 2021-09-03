import { yupResolver } from '@hookform/resolvers/yup';
import { Order } from 'models';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import LinearAlternativeLabel from './LinearAlternativeLabel';

interface TeamFormProps {
  initialValue: Order;
  onSubmit?: (formValue: Order) => void;
  isEdit: boolean;
}
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export default function OrderForm({ initialValue, onSubmit, isEdit }: TeamFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    fromStation: yup.object().shape({
      longitude: yup.string().required(t('common.isRequired')),
      latitude: yup.string().required(t('common.isRequired')),
      address: yup.string().required(t('common.isRequired')),
      district: yup.string().required(t('common.isRequired')),
      ward: yup.string().required(t('common.isRequired')),
      city: yup.string().required(t('common.isRequired'))
    }),
    toStation: yup.object().shape({
      longitude: yup.string().required(t('common.isRequired')),
      latitude: yup.string().required(t('common.isRequired')),
      address: yup.string().required(t('common.isRequired')),
      district: yup.string().required(t('common.isRequired')),
      ward: yup.string().required(t('common.isRequired')),
      city: yup.string().required(t('common.isRequired'))
    }),
    orderCode: yup.string().required(t('common.isRequired')),
    orderInfoObj: yup.object().shape({
      cod: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      totalPriceOrder: yup
        .number()
        .positive(t('common.isNumberPositive'))
        .required(t('common.isRequired')),
      weight: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      length: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      width: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      height: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      note: yup.string().notRequired(),
      receiverName: yup.string().required(t('common.isRequired')),
      email: yup.string().email(t('common.emailError')).max(255).required(t('common.isRequired')),
      phone: yup
        .string()
        .required(t('common.isRequired'))
        .matches(phoneRegExp, t('common.phoneError')),
      serviceCharge: yup
        .number()
        .positive(t('common.isNumberPositive'))
        .required(t('common.isRequired')),
      incurred: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired'))
    }),
    packageItems: yup
      .array()
      .of(
        yup.object().shape({
          quantity: yup
            .number()
            .positive(t('common.isNumberPositive'))
            .required(t('common.isRequired')),
          description: yup.string().required(t('common.isRequired')),
          code: yup.string().required(t('common.isRequired'))
        })
      )
      .required()
  });
  const methods = useForm<Order>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;
  const { isDirty } = useFormState({ control });
  const handelFormSubmit = (formValues: Order) => {
    if (onSubmit) onSubmit(formValues);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handelFormSubmit)}>
        <LinearAlternativeLabel isDirty={isDirty} isSubmitting={isSubmitting} />
      </form>
    </FormProvider>
  );
}
