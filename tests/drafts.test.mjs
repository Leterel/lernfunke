import test from 'node:test';
import assert from 'node:assert/strict';
import {MAX_DRAFT_BYTES,validateDraftCode,validateDraftRecord} from '../drafts.js';
test('draft validation bounds UTF-8 and accepts only known lesson records',()=>{
 assert.equal(validateDraftCode('js-return-1',''),'');
 assert.equal(validateDraftCode('js-return-1','x'.repeat(MAX_DRAFT_BYTES)).length,MAX_DRAFT_BYTES);
 for(const value of ['x'.repeat(MAX_DRAFT_BYTES+1),'ü'.repeat(MAX_DRAFT_BYTES),'\ud800',null])assert.throws(()=>validateDraftCode('js-return-1',value));
 assert.throws(()=>validateDraftCode('__proto__','return 1;'));
 assert.equal(validateDraftRecord(undefined,'js-return-1'),null);
 const valid={lesson:'js-return-1',code:'return 2;',revision:1};assert.deepEqual(validateDraftRecord(valid,'js-return-1'),valid);
 for(const value of [null,{...valid,lesson:'js-cart-1'},{...valid,revision:0},{...valid,revision:1.5},{...valid,extra:true}])assert.throws(()=>validateDraftRecord(value,'js-return-1'));
});
