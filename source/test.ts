// builtin
import { tmpdir } from 'os'
import { join } from 'path'

// external
import { equal } from 'assert-helpers'
import kava from 'kava'
import { isAccessible, R_OK, W_OK } from '@bevry/fs-accessible'
import read from '@bevry/fs-read'
import promiseErrback from 'promise-errback'

// local
import write from './index.js'

kava.suite('@bevry/fs-write', function (suite, test) {
	test('works as expected', function (done) {
		promiseErrback(async function () {
			// prepare the paths
			const directory = join(tmpdir(), `bevry-fs-write-${Math.random()}`)
			const file = join(directory, 'file.txt')
			const data = String(Math.random())

			// create the paths, no need for mkdirp as write handles it
			await write(file, data)

			// test the paths
			equal(await isAccessible(file), true, 'is accessible when it is present')
			equal(
				await isAccessible(file, R_OK),
				true,
				'is readable when it is present'
			)
			equal(
				await isAccessible(file, W_OK),
				true,
				'is writable when it is present'
			)
			equal(await read(file), data, 'has the data we expected')
		}, done)
	})
})
