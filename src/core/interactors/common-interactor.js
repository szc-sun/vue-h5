import { Request } from '@/core/services/http/request'
import { CARDS, VIDEO } from '@/constants/api/test'

class TestHttpInteractor {
  service
  constructor(service) {
    this.service = service
  }
  async getVideo(params) {
    try {
      const options = { url: VIDEO, params }
      return await this.service.getV(options)
    } catch (error) {
      throw error
    }
  }
  async getTest(params) {
    try {
      const options = { url: CARDS, params }
      return await this.service.get(options)
    } catch (error) {
      throw error
    }
  }
  async createTest(data) {
    try {
      const optons = { url: CARDS, data }
      return await this.service.post(optons)
    } catch (error) {
      throw error
    }
  }
  async deleteTest(id) {
    try {
      const options = { url: `${CARDS}/${id}` }
      return await this.service.delete(options)
    } catch (error) {
      throw error
    }
  }
  async updateTest(data, id) {
    try {
      const optons = { url: `${CARDS}/${id}`, data }
      return await this.service.put(optons)
    } catch (error) {
      throw error
    }
  }
}

const testHttpInteractor = new TestHttpInteractor(Request.getInstance())
export default testHttpInteractor
