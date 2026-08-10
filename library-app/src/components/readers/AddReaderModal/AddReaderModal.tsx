import { useDispatch } from 'react-redux';
import { useRef, type FormEventHandler } from 'react';
import { addReader } from '../../../store/readers-slice';
type Props = {
  handleClose: () => void;
}
const AddReaderModal = ({ handleClose }: Props) => {
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').replace(/^7/, '').slice(0, 10);
  
    let result = '+7';
  
    if (numbers.length > 0) {
      result += ` (${numbers.slice(0, 3)}`;
    }
  
    if (numbers.length >= 3) {
      result += ')';
    }
  
    if (numbers.length > 3) {
      result += ` ${numbers.slice(3, 6)}`;
    }
  
    if (numbers.length > 6) {
      result += `-${numbers.slice(6, 8)}`;
    }
  
    if (numbers.length > 8) {
      result += `-${numbers.slice(8, 10)}`;
    }
  
    return result;
  };

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    dispatch(addReader({
      fullName: fullNameRef.current?.value,
      email: emailRef.current?.value,
      phone: phoneRef.current?.value
    }));
    handleClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Добавить читателя</h2>
        <form onSubmit={submitHandler}>
          <input id="fullName" ref={fullNameRef} type="text" placeholder="ФИО" />
          <input id="email" ref={emailRef} type="email" placeholder="Email" />
          <label htmlFor="phone">Номер телефона</label>
          <label htmlFor="phone">Номер телефона</label>
          <input
        id="phone"
            ref={phoneRef}
            type="tel"
            placeholder="+7 (999) 123-45-67"
            defaultValue="+7 "
            inputMode="tel"
            maxLength={18}
            pattern="\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}"
            onInput={(event) => {
                const input = event.currentTarget;
                input.value = formatPhone(input.value);
            }}
            />

          
          <button type="submit" className="btn btn-primary">Сохранить</button>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>Отмена</button>
        </form>
      </div>
    </div>
  );
};

export default AddReaderModal;