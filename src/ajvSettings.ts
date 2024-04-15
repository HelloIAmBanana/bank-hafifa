import Ajv from "ajv";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

export default ajv;
