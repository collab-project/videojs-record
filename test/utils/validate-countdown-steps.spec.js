/**
 * @since 4.9.0
 */

import validateCountdownSteps from '../../src/js/utils/validate-countdown-steps';


/** @test {validate-countdown-steps} */
describe('validate-countdown-steps', () => {

    /** @test {validateCountdownSteps} */
    it('undefined is not valid', () => {
        expect(validateCountdownSteps(undefined)).toBeFalse();
    });

    /** @test {validateCountdownSteps} */
    it('empty array is valid', () => {
        expect(validateCountdownSteps([])).toBeTrue();
    });

    /** @test {validateCountdownSteps} */
    it('empty step is not valid', () => {
        expect(validateCountdownSteps([{}])).toBeFalse();
    });

    /** @test {validateCountdownSteps} */
    it('step without value is not valid', () => {
        expect(validateCountdownSteps([{time: 1000}])).toBeFalse();
    });

    /** @test {validateCountdownSteps} */
    it('step without time is not valid', () => {
        expect(validateCountdownSteps([{value: 'Three'}])).toBeFalse();
    });

    /** @test {validateCountdownSteps} */
    it('step with time and value is valid', () => {
        expect(validateCountdownSteps([{time: 1000, value: 'Three'}])).toBeTrue();
    });

    /** @test {validateCountdownSteps} */
    it('step with a string int value is not valid', () => {
        expect(validateCountdownSteps([{time: '1000', value: 'Three'}])).toBeFalse();
    });

    /** @test {validateCountdownSteps} */
    it('step with a string value is not valid', () => {
        expect(validateCountdownSteps([{time: 1000, value: 'Three'}, {time: 'Two', value: 'Two'}])).toBeFalse();
    });

    /** @test {validateCountdownSteps} */
    it('step without time is not valid', () => {
        expect(validateCountdownSteps([{time: 1000, value: 'Three'}, {value: 'Two'}])).toBeFalse();
    });

    /** @test {validateCountdownSteps} */
    it('step without value is not valid', () => {
        expect(validateCountdownSteps([{time: 1000, value: 'Three'}, {time: 400}])).toBeFalse();
    });

    /** @test {validateCountdownSteps} */
    it('steps with time and value are valid', () => {
        expect(validateCountdownSteps([{time: 500, value: 'Three'}, {time: 400, value: 'Two'}])).toBeTrue();
    });

    /** @test {validateCountdownSteps} */
    it('step with extra property is valid', () => {
        expect(validateCountdownSteps([{time: 500, value: 'Three', foo: 'bar'}])).toBeTrue();
    });
});
