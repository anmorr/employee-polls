import { renderHook, act } from '@testing-library/react';
import { useTextField } from '../hooks';




test('will return a set of value prop and a callback for setting the value prop ', () => {
  const { result } = renderHook(() => useTextField('AwesomeHook'));
  expect(result.current[0].value).toEqual('AwesomeHook')
  
});
