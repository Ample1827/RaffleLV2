import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function Contact() {
  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Contáctanos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ¿Tienes preguntas sobre nuestras rifas? ¿Necesitas ayuda con tu cuenta? Estamos aquí para ayudarte 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <Input placeholder="Juan" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    <Input placeholder="Pérez" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                  <Input type="email" placeholder="juan@ejemplo.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                  <Input placeholder="¿Cómo podemos ayudarte?" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <Textarea placeholder="Cuéntanos más sobre tu pregunta o inquietud..." rows={5} />
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3">Enviar Mensaje</Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
              <p className="text-gray-600 mb-8">
                ¡Siempre estamos felices de ayudar! Contáctanos a través de cualquiera de estos canales y te
                responderemos lo antes posible.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Envíanos un Email</h4>
                  <p className="text-gray-600">soporte@rafflepro.com</p>
                  <p className="text-sm text-gray-500">Responderemos en 2 horas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Llámanos</h4>
                  <p className="text-gray-600">+52 (55) 1234-5678</p>
                  <p className="text-sm text-gray-500">Disponible 24/7</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Visítanos</h4>
                  <p className="text-gray-600">
                    Av. Reforma 123
                    <br />
                    Ciudad de México, CDMX 06600
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Horarios de Atención</h4>
                  <p className="text-gray-600">Soporte al Cliente 24/7</p>
                  <p className="text-sm text-gray-500">Siempre aquí cuando nos necesites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
